#!/bin/bash

# Once your droplet's awake & your ssh keys are good to go,
# Run this script and pass the droplet's hostname as the first & only argument

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given an IP?
if [[ ! $1 || $2 ]]
then
  err "Provide droplet's hostname as the first & only arg"
fi

# Check our given IP and the default ssh credentials
if ! ssh -q $1 exit 2> /dev/null
then
  err "Couldn't open an ssh connection to $1"
fi

internal_ip=`ssh $1 ifconfig eth1 | grep 'inet addr' | awk '{print $2;exit}' | sed 's/addr://'`

####################
# Get data for setting environment vars

if [[ $BJVM_DOMAINNAME != "" ]]
then
  domainname=$BJVM_DOMAINNAME
else
  echo "At which domain name will you be publishing this bjvm?"
  read domainname
fi

if [[ $BJVM_EMAIL != "" ]]
then
  email=$BJVM_EMAIL
else
  echo "At which email do you want to receive alerts from certbot?"
  read email
fi

####################
# Begin main heredoc
ssh $1 "bash -s" <<EOF

########################################
# Set env vars

if ! grep BJVM_EMAIL /etc/environment
then
  echo "Initializing server with email: $email"
  echo "BJVM_EMAIL=\"$email\"" >> /etc/environment
fi

if ! grep BJVM_DOMAINNAME /etc/environment
then
  echo "Initializing server with domain name: $domainname"
  echo "BJVM_DOMAINNAME=\"$domainname\"" >> /etc/environment
fi

########################################
# Upgrade Everything

# update & upgrade without prompts
# https://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade
apt-get autoremove -y

########################################
# Setup firewall

ufw --force reset
ufw allow 22 &&\
ufw allow 80 &&\
ufw allow 443 &&\
ufw --force enable

########################################
# Install Docker & Node

# Install docker dependencies
apt-get install -y apt-transport-https ca-certificates curl software-properties-common make pandoc

# Add the node repo
curl -sL https://deb.nodesource.com/setup_8.x | bash -

# Get the docker team's official gpg key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# Add the docker repo
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   \`lsb_release -cs\` \
   stable"

apt-get update -y
apt-get install -y docker-ce=17.09.0~ce-0~ubuntu nodejs

systemctl enable docker

docker swarm init --advertise-addr $internal_ip 2> /dev/null

########################################
# Setup git repo & deployment machine

mkdir -vp /var/bjvm
mkdir -vp /var/bjvm.git

cd /var/bjvm.git

if [[ ! -d hooks ]]
then
  git init --bare
fi

tee hooks/post-receive <<'EOIF'
#!/bin/bash
git --work-tree=/var/bjvm --git-dir=/var/bjvm.git checkout -f
cd /var/bjvm
bash ops/secret-init.sh
npm run deploy
EOIF

chmod -v 755 hooks/post-receive

########################################
# Double-check upgrades & reboot

## For some reason, gotta upgrade again to get it all
apt-get update -y
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" dist-upgrade
apt-get autoremove -y

echo "Restarting remote server..."
sleep 3 && reboot &
exit

EOF

# Add a remote git repo to push to
git remote remove $1 2> /dev/null
git remote add $1 ssh://$1:/var/bjvm.git

echo;
echo "If you didn't see any errors above, we're good to go."
echo "  push to your droplet with: git push $1"

