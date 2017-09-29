#!/bin/bash

# Don't actually run this script until I thoroughly test it
echo "Error: Untested. Aborting.."
exit 1

# Go to digitalocean and create a new Ubuntu 16.04 droplet
# Make sure you add ssh keys. If you don't have any, generate them with:
# ssh-keygen -t rsa -b 4096 -C "bohende@gmail.com"

# Once your droplet's awake, login as root with:
# ssh root@ip.add.re.ss

# Then, you're ready to execute this script
# But first, change the following to fit your own personal situation

NAME=user
PW=passw0rd

# Let's go

# First thing we'll do is create a user who can login normally

# chpasswd lets us create a user without any interactive prompts
chpasswd $NAME:$PW

# add this user to the sudo group
# -a for append, -G for group. 
usermod -aG sudo $NAME

# root has an .ssh folder, we want one just like it
cp -r /root/.ssh /home/$NAME/.ssh
chown -R $NAME:$NAME .ssh

# disable root login
sudo sed -i 's/#\?PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config 

# activate a firewall that lets our ssh traffic through
sudo ufw allow OpenSSH && sudo ufw enable

# Done working as a root shell, confirm then quit
echo "Open a new terminal to confirm user $NAME can login. Then, close this shell"

