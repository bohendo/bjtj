#!/bin/bash

# Go to digitalocean and create a new Ubuntu 16.04 droplet
# Make sure you add ssh keys. If you don't have any, generate them with:
# ssh-keygen -t rsa -b 4096 -C "name@example.com"

# Once your droplet's awake & your ssh keys are configured to login w/out pass,
# Run this script and pass it's IP as the first argument

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given an IP?
if [[ ! $1 || $2 ]]; then err "Provide droplet's IP as the first & only arg"; fi
IP=$1

# Check our given IP and the default ssh credentials
ssh -q root@$IP exit
if [[ $? -ne 0 ]]; then err "SSH Connection Error"; fi

####################
# Begin main heredoc
ssh root@$IP "bash -s" <<EOF

########################################
# Installations

# add node repo and update our apt cache
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

# https://askubuntu.com/questions/146921/how-do-i-apt-get-y-dist-upgrade-without-a-grub-config-prompt
DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade

apt-get autoremove -y

apt-get install -y git
apt-get install -y nginx
apt-get install -y nodejs

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

id -u git
if [[ $? -ne 0 ]]; then

  adduser --disabled-password --gecos "" git
  cp -r /root/.ssh /home/git/.ssh
  chown -R git:git /home/git/.ssh

  # git will be the one who deploys so give them permission to
  usermod -aG www-data git
fi

########################################
# Remote repo setup

mkdir -p /var/git/live.git
mkdir -p /var/git/live

cd /var/git/live.git

if [[ ! -d hooks ]]; then
  git init --bare

  echo '#!/bin/bash' > hooks/post-receive
  echo 'git --work-tree=/var/git/live --git-dir=/var/git/live.git checkout -f' >> hooks/post=receive
  echo '' >> hooks/post=receive

  chmod 755 hooks/post-receive

fi

chown -R git:git /var/git

mkdir -p /var/www/live

EOF

if [[ ! `git branch --list live` ]]
then
  git remote add live ssh://git@$IP:/var/git/live.git
fi

echo;echo "We're good to go, git push to live whenever you're ready to deploy.";

