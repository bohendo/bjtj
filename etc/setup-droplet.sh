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

scp ./nginx.conf root@$IP:~

####################
# Begin main heredoc

# `backticks` around delimiter means don't execute them in heredoc
ssh root@$IP "bash -s" <<`EOF`

########################################
# Firewalls

# Clear all rules & disable firewall
ufw --force reset > /dev/null

# only allow ssh, http, and https traffic
ufw allow 22  > /dev/null &&\
ufw allow 80  > /dev/null &&\
ufw allow 443 > /dev/null &&\
ufw --force enable > /dev/null
# chained && means we shouldn't enable the firewall unless
# all of the previous commands succeeded

########################################
# Installations

# First: make sure our system is up to date
apt-get update -y
apt-get upgrade -y
apt-get autoremove -y

if ! hash git 2> /dev/null; then
  sudo apt-get install git -y
fi

if ! hash nginx 2> /dev/null; then
  sudo apt-get install nginx -y
fi

if ! hash node 2> /dev/null; then
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt install -y nodejs
fi

########################################
# Create users & groups

id -u git &> /dev/null
if [[ $? -eq 1 ]]; then

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

########################################
# Configure nginx

# We scp'ed stuff to ~
cd ~
sed -i 's/server_name .*;/server_name '`hostname`';/' nginx.conf
mv -f nginx.conf /etc/nginx/nginx.conf
chmod 644 /etc/nginx/nginx.conf
chown www-data /etc/nginx/nginx.conf

nginx -t 2> /dev/null
if [[ $? -eq 0 ]]; then
  systemctl reload nginx
else
  echo "Syntax error in nginx.conf"
fi


`EOF`

git remote add live ssh://git@$IP:/var/git/live.git
git push -u live master

echo "You're good to go"

