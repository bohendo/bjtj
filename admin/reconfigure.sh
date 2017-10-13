#!/bin/bash

########################################
# Sanity Check: can we ssh to this hostname?

if [[ ! $1 || $2 ]]
then
  err "Provide droplet's hostname as the first & only arg"
fi
hostname=$1


# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

ssh -q $hostname exit
if [[ $? -ne 0 ]]; then err "Couldn't open an ssh connection to $hostname (have you run setup-droplet.sh?)"; fi

########################################
# Send our config files to our remote server

scp nginx.conf $hostname:/etc/nginx/nginx.conf
scp mongod.conf $hostname:/etc/mongod.conf

########################################
# Tweak config files and reload services

# `ticks` around delimiter means don't execute `expressions` before sending heredoc
ssh $hostname "bash -s" <<`EOF`

# Make sure our nginx config is for the correct servername
sed -i 's/server_name .*;/server_name '`hostname`';/' /etc/nginx/nginx.conf

nginx -t
if [[ $? -eq 0 ]]
then
  systemctl restart nginx
  systemctl status nginx
else
  echo "Syntax error in nginx.conf"
fi

# restart mongod
chown -v mongodb:mongodb /etc/mongod.conf
chmod -v 600 /etc/mongod.conf
systemctl restart mongod
systemctl status mongod

`EOF`

