#!/bin/bash

# Go to digitalocean and create a new Ubuntu 16.04 droplet
# Make sure you add ssh keys. If you don't have any, generate them with:
# ssh-keygen -t rsa -b 4096 -C "name@example.com"

# Once your droplet's awake & your ssh keys are properly configured,
# Run this script and pass it's IP as the first argument

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given an IP?
if [[ ! $1 ]]; then err "Provide droplet's IP as the first arg"; fi

USER=bjvm
IP=$1

# Check our given IP and the default ssh credentials
ssh -q root@$IP exit
if [[ $? -ne 0 ]]; then err "SSH Connection Error"; fi

# First thing we'll do is create a non-root user
ssh root@$IP "bash -s" <<EOF
# Check to see whether $USER already exists (do nothing if so)
id -u $USER &> /dev/null
if [[ $? -eq 1 ]]; then

  # First: make sure our system is up to date
  apt-get update -y
  apt-get upgrade -y
  apt-get autoremove -y

  # Create a user without a password (we'll rely on ssh key for auth)
  adduser --disabled-password --gecos \"\" $USER

  # add this user to the sudo group (-a for append, -G for group)
  usermod -aG sudo $USER

  # root already has an .ssh folder, we want one just like it
  cp -r /root/.ssh /home/$USER/.ssh
  chown -R $USER:$USER /home/$USER/.ssh

  # Given our user sudo access w/out requiring a password
  echo "$USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
fi
EOF

# Did we correctly configure our user for ssh login?
ssh -q $USER@$IP exit
if [[ $? -ne 0 ]]; then err "Created user can't log in. Aborting"; fi
  
# If our new user is good, then disable root login
ssh root@$IP "bash -s" <<EOF
    sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config 
EOF

# Exit if our config file is already setup
success="ssh connection to $IP initialized. Login with: ssh bjvm"
grep -q $IP "$HOME/.ssh/config"
if [[ $? -eq 0 ]]; then echo $success; exit; fi

# Add this connection to our ssh config
cat <<EOF >>"$HOME/.ssh/config"

Host bjvm
  HostName $IP
  User $USER
  IdentityFile ~/.ssh/id_rsa
EOF

echo $success

