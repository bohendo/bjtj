#!/bin/bash

# This script sets up a remote server (bjvm) to act as a git repository
# When we push to this repo, our bjvm app will be built and deployed

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check: can we even ssh to the server we're setting up?
ssh -q bjvm exit
if [[ $? -ne 0 ]]; then err "can't ssh to bjvm, did you initialize this droplet?"; fi

IP=`ssh -G bjvm | awk '/^hostname/ {print $2}'`
 
# Let's start setting up
ssh bjvm "bash -s" <<EOF

# Install git if it's not already installed
if ! hash git 2> /dev/null; then
  sudo apt-get update -y
  sudo apt-get upgrade -y
  sudo apt-get install git -y
fi

# Create a git user if one doesn't already exist
id -u git &> /dev/null
if [[ $? -eq 1 ]]; then

  sudo adduser --disabled-password --gecos "" git
  sudo cp -r /root/.ssh /home/git/.ssh
  sudo chown -R git:git /home/git/.ssh

  # git will be the one who deploys so give them permission to
  sudo usermod -aG www-data git
  
  # Add our default user to git's group so we can edit these files
  sudo usermod -aG git bjvm
fi

sudo mkdir -p /var/www/live
sudo mkdir -p /var/git/live.git
sudo mkdir -p /var/git/bjvm

cd /var/git/live.git

if [[ ! -d hooks ]]; then
  sudo git init --bare

  printf '#!/bin/bash\ngit --work-tree=/var/git/bjvm --git-dir=/var/git/bjvm.git checkout -f\n' | sudo tee hooks/post-receive
  sudo chmod 755 hooks/post-receive

fi

sudo chown -R git:git /var/git

EOF

git remote add live ssh://git@$IP:/var/git/live.git
git push -u live master

