#!/bin/bash

# Go to digitalocean and create a new Ubuntu 16.04 droplet
# Make sure you add ssh keys. If you don't have any, generate them with:
# ssh-keygen -t rsa -b 4096 -C "name@example.com"

# Once your droplet's awake & your ssh keys are configured to login w/out pass,
# Run this script and pass the droplet's IP as the first & only argument

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given an IP?
if [[ ! $1 || $2 ]]; then err "Provide droplet's IP as the first & only arg"; fi
IP=$1

# Check our given IP and the default ssh credentials
ssh -q root@$IP exit
if [[ $? -ne 0 ]]; then err "Couldn't open an ssh connection to root@$IP"; fi

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
apt-get install -y make
apt-get install -y pandoc

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
  echo 'git --work-tree=/var/git/live --git-dir=/var/git/live.git checkout -f' >> hooks/post-receive
  echo 'ln -sfT /var/www/live /var/git/live/dist' >> hooks/post-receive
  echo 'cd /var/git/live' >> hooks/post-receive
  echo 'make all' >> hooks/post-receive

  chmod 755 hooks/post-receive

fi

chown -R git:git /var/git

mkdir -p /var/www/live
chown -R www-data:www-data /var/www
chmod 775 /var/www
chmod 775 /var/www/live

EOF

# Add a remote git repo to push to
if ! git ls-remote live 2> /dev/null
then
  git remote add live ssh://git@$IP:/var/git/live.git
fi


# Add bjvm to our ssh/config
if grep -Fxq $IP ~/.ssh/config
then
  echo >> ~/.ssh/config
  echo "Host bjvm" >> ~/.ssh/config
  echo "  Hostname $IP" >> ~/.ssh/config
  echo "  User root" >> ~/.ssh/config
  echo "  IdentityFile ~/.ssh/id_rsa" >> ~/.ssh/config
fi

bash reconfigure.sh

echo;
echo "If you didn't see any errors above, we're good to go."
echo "  ssh to your droplet with: ssh bjvm"
echo "  push to your droplet with: git push -u live master";

