#!/bin/bash

# Go to digitalocean and create a new Ubuntu 16.04 droplet
# Make sure you add ssh keys. If you don't have any, generate them with:
# ssh-keygen -t rsa -b 4096 -C "name@example.com"

# Once your droplet's awake & your ssh keys are configured to login w/out pass,
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

####################
# Begin main heredoc
ssh root@$IP "bash -s" <<EOF

########################################
# Installations

# update & upgrade without prompts
# https://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade

# Add node repo: https://github.com/nodesource/distributions#debinstall
curl --silent https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -
echo "deb https://deb.nodesource.com/node_6.x xenial main" > /etc/apt/sources.list.d/nodesource.list
echo "deb-src https://deb.nodesource.com/node_6.x xenial main" >> /etc/apt/sources.list.d/nodesource.list

# Add certbot repo
add-apt-repository ppa:certbot/certbot -y

# Add mongo repo
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

# Update & install stuff
apt-get update -y
apt-get install -y git nginx nodejs make pandoc software-properties-common python-certbot-nginx mongodb-org


########################################
# Firewalls

# Clear all rules & disable firewall
ufw --force reset

# only allow ssh, http, and https traffic
ufw allow 22  &&\
ufw allow 80  &&\
ufw allow 443 &&\
ufw --force enable
# chained && means we shouldn't enable the firewall unless
# all of the previous commands succeeded

########################################
# Create users & groups

if ! getent passwd git
then
  adduser --disabled-password --gecos "" git
  cp -vr /root/.ssh /home/git/.ssh
  chown -vR git:git /home/git/.ssh
  # git will be the one who deploys so give them permission to
  usermod -aG www-data git
fi

########################################
# Remote repo setup

mkdir -vp /var/git/live.git
mkdir -vp /var/git/live

cd /var/git/live.git

if [[ ! -d hooks ]]
then
  git init --bare

  echo "Writing to hooks/post-receive..."
  echo '#!/bin/bash' | tee hooks/post-receive
  echo 'git --work-tree=/var/git/live --git-dir=/var/git/live.git checkout -f' | tee -a hooks/post-receive
  echo 'mkdir -p /var/git/live/build/public' | tee -a hooks/post-receive
  echo 'ln -sfT /var/www/live /var/git/live/build/public' | tee -a hooks/post-receive
  echo 'cd /var/git/live' | tee -a hooks/post-receive
  echo 'npm run deploy' | tee -a hooks/post-receive

  chmod -v 755 hooks/post-receive

fi

########################################
# Set appropriate ownership/permissions

mkdir -vp /var/www/live

chown -vR www-data:www-data /var/www
chown -vR git:git /var/git

chmod -v 775 /var/www
chmod -v 775 /var/www/live

########################################
# Restart to finish updates

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
if grep -Fxq $hostname ~/.ssh/config
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
bash reconfigure.sh

echo;
echo "If you didn't see any errors above, we're good to go."
echo "  ssh to your droplet with: ssh bjvm"
echo "  push to your droplet with: git push -u live master";

