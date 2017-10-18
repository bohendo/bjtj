#!/bin/bash

# Go to digitalocean and create a new Ubuntu 16.04 droplet
# Create an attach a 100GB volume to this droplet
# Make sure you add ssh keys. If you don't have any, generate them with:
# ssh-keygen -t rsa -b 4096 -C "name@example.com"

# Once your droplet's awake & your ssh keys are good to go,
# Run this script and pass the droplet's IP as the first & only argument

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given an IP?
if [[ ! $1 || $2 ]]
then
  err "Provide droplet's IP as the first & only arg"
fi
IP=$1

# Check our given IP and the default ssh credentials
ssh -q root@$IP exit
if [[ $? -ne 0 ]]
then
  err "Couldn't open an ssh connection to root@$IP"
fi

hostname=`ssh root@$IP hostname`

# Generate some secrets

if [[ ! -f .mongo.secret ]]
then
  head -c33 /dev/random | base64 | tr -d '\n\r' > .mongo.secret
  chmod 600 .mongo.secret
fi
mongopwd=`cat .mongo.secret`

if [[ ! -f .geth.secret ]]
then
  head -c33 /dev/random | base64 | tr -d '\n\r' > .geth.secret
  chmod 600 .geth.secret
fi
gethpwd=`cat .geth.secret`

if ! grep '*.secret' ../.gitignore
then
  printf "# Secret\n*.secret\n" >> ../.gitignore
fi

####################
# Begin main heredoc
ssh root@$IP "bash -s" <<EOF

########################################
# Installations

# update & upgrade without prompts
# https://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
apt-get update -y
apt-get install software-properties-common -y
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade

# Add node repo: https://github.com/nodesource/distributions#debinstall
curl --silent https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
echo "deb https://deb.nodesource.com/node_6.x xenial main" > /etc/apt/sources.list.d/nodesource.list
echo "deb-src https://deb.nodesource.com/node_6.x xenial main" >> /etc/apt/sources.list.d/nodesource.list

# Add certbot repo
add-apt-repository -y ppa:certbot/certbot

# Add mongo repo
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list

# Add ethereum repo
add-apt-repository -y ppa:ethereum/ethereum

# Update & install stuff from apt
apt-get update -y
apt-get install -y git nginx nodejs make pandoc software-properties-common python-certbot-nginx mongodb-org ethereum

# Update & install stuff from npm
npm install pm2 -g

systemctl enable nginx
systemctl restart nginx
systemctl status nginx


########################################
# Setup extra storage

# Attach drive
if [[ ! -d /mnt/vol ]]
then
  mkdir -p /mnt/vol
  mount -o discard,defaults /dev/disk/by-id/scsi-0DO_Volume_devol /mnt/vol
  echo /dev/disk/by-id/scsi-0DO_Volume_devol /mnt/vol ext4 defaults,nofail,discard 0 0 | tee -a /etc/fstab
fi

########################################
# Firewalls

# Clear all rules & disable firewall
# --force means don't ask for confirmation
ufw --force reset

# only allow ssh, http, https, and geth traffic
ufw allow 22  &&\
ufw allow 80  &&\
ufw allow 443 &&\
ufw allow 30303 &&\
ufw --force enable
# chained && means we shouldn't enable the firewall unless
# all of the previous commands succeeded

########################################
# Create users & groups

if ! getent passwd git
then
  adduser --disabled-password --gecos "" git
  cp -vr /root/.ssh /home/git/.ssh
  # git will be the one who deploys to /var/www/live
  usermod -aG www-data git
fi

if ! getent passwd geth
then
  adduser --disabled-password --gecos "" geth
fi

########################################
# Setup ethereum node

if [[ ! -d /home/geth/.ethereum ]]
then

  mkdir -p /mnt/vol/ethereum
  ln -sfT /mnt/vol/ethereum /home/geth/.ethereum

  tee /etc/systemd/system/geth.service <<EOIF
[Unit]
Description=Ethereum go client

[Service]
Type=simple
User=geth
Group=geth
ExecStart=geth --syncmode light 2> /home/geth/.ethereum/geth.log

[Install]
WantedBy=default.target
EOIF

  systemctl enable /etc/systemc/system/geth.service
  systemctl start /etc/systemc/system/geth.service

  # Create an account key encrypted with the given password
  echo "$gethpwd" > .geth.secret
  geth --password .geth.secret account new
  rm .geth.secret

fi

chown -vR geth:geth /home/geth
chown -vR geth:geth /mnt/vol/ethereum


########################################
# Setup git repo & deployment machine

mkdir -vp /var/www/live
mkdir -vp /var/git/live.git
mkdir -vp /var/git/live/admin

# How node will authenticate w mongo
echo $mongopwd > /var/git/live/admin/.mongo.secret

cd /var/git/live.git

if [[ ! -d hooks ]]
then
  git init --bare

  tee hooks/post-receive <<EOIF
#!/bin/bash
git --work-tree=/var/git/live --git-dir=/var/git/live.git checkout -f
mkdir -p /var/git/live/build
rm -rf /var/git/live/build/public
ln -sfT /var/www/live /var/git/live/build/public
cd /var/git/live
npm install
npm run build
npm run deploy
EOIF

fi

chmod -v 775 /var/www
chmod -v 775 /var/www/live
chmod -v 755 hooks/post-receive

chown -vR www-data:www-data /var/www
chown -vR git:git /var/git
chown -vR git:git /home/git


########################################
# Setup Mongo

if ! systemctl is-enabled mongod
then

  rm -rf /var/lib/mongodb
  ln -sfT /mnt/vol/mongo /var/lib/mongodb

  systemctl start mongod

  mongo <<EOIF
  use admin

  db.createUser(
    {
      user: 'admin',
      pwd: '$mongopwd',
      roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
    }
  )

  use bjvm

  db.createUser(
    {
      user: 'bjvm',
      pwd: '$mongopwd',
      roles: [ { role: 'readWrite', db: 'bjvm' } ]
    }
  )
  EOIF

  systemctl restart mongod
  systemctl enable mongod
  systemctl status mongod

fi

chown -v  mongodb:mongodb /etc/mongod.conf
chown -vR mongodb:mongodb /var/lib/mongodb
chown -vR mongodb:mongodb /var/log/mongodb


########################################
# Restart & finish updates

apt-get update -y
apt-get upgrade -y
apt-get autoremove -y
echo "Restarting remote server..."
sleep 3 && reboot &
exit

EOF

# Add a remote git repo to push to
if ! git ls-remote $hostname 2> /dev/null
then
  git remote add $hostname ssh://git@$IP:/var/git/live.git
fi

# Add bjvm to our ssh/config
if ! grep $hostname ~/.ssh/config
then
  echo "Updating ~/.ssh/config.."
  echo | tee -a ~/.ssh/config
  echo "Host $hostname" | tee -a ~/.ssh/config
  echo "  Hostname $IP" | tee -a ~/.ssh/config
  echo "  User root" | tee -a ~/.ssh/config
  echo "  IdentityFile ~/.ssh/id_rsa" | tee -a ~/.ssh/config
fi

echo "Waiting for server to finish rebooting..."
sleep 15
bash reconfigure.sh $hostname

echo;
echo "If you didn't see any errors above, we're good to go."
echo "  ssh to your droplet with: ssh $hostname"
echo "  push to your droplet with: git push -u $hostname master";

