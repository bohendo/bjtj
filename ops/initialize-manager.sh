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

####################
# Get data to set as environment vars

if [[ $BJVM_DOMAINNAME == "" ]]
then
  echo "At which domain name will you be publishing this bjvm?"
  read domainname
else
  echo "At which domain name will you be publishing this bjvm? [default: $BJVM_DOMAINNAME]"
  read domainname
  if [[ $domainname == "" ]]
  then
    domainname=$BJVM_DOMAINNAME
  fi
fi

if [[ $BJVM_EMAIL == "" ]]
then
  echo "At which email do you want to receive alerts from certbot?"
  read email
else
  echo "At which email do you want to receive alerts from certbot? [default: $BJVM_EMAIL]"
  read email
  if [[ $email == "" ]]
  then
    email=$BJVM_EMAIL
  fi
fi

echo "Proceeding with email=$email and domainname=$domainname"

####################
# little more setup before main here doc

if [ -f ~/.bash_aliases ]
then
  scp ~/.bash_aliases $1:/root/.bash_aliases
fi

internal_ip=`ssh $1 ifconfig eth1 | grep 'inet addr' | awk '{print $2;exit}' | sed 's/addr://'`

####################
# main heredoc

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

if ! grep NODE_ENV /etc/environment
then
  echo "NODE_ENV=\"production\"" >> /etc/environment
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
# Install Docker

# Install docker dependencies
apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Get the docker team's official gpg key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# Add the docker repo
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   \`lsb_release -cs\` \
   stable"

apt-get update -y
apt-get install -y docker-ce=17.09.0~ce-0~ubuntu

systemctl enable docker

docker swarm init --advertise-addr $internal_ip 2> /dev/null

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

