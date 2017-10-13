#!/bin/bash

########################################
# Sanity Check: can we ssh to bjvm?

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

ssh -q bjvm exit
if [[ $? -ne 0 ]]; then err "Couldn't open an ssh connection to bjvm (have you run setup-droplet.sh?)"; fi

########################################
# Send our config files to our remote server

# scp mongo.conf bjvm:/etc/mongo.conf

########################################
# Tweak config files and reload services

# `ticks` around delimiter means don't execute `expressions` before sending heredoc
ssh bjvm "bash -s" <<`EOF`

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

sudo apt-get update -y && sudo apt-get install -y mongodb-org

`EOF`

