#!/bin/bash

########################################
# Sanity Check: can we ssh to bjvm?

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

ssh -q bjvm exit
if [[ $? -ne 0 ]]; then err "Couldn't open an ssh connection to bjvm (have you run setup-droplet.sh?)"; fi

########################################
# Send our config files to our remote server

scp nginx.conf bjvm:/etc/nginx/nginx.conf

########################################
# Tweak config files and reload services

# `ticks` around delimiter means don't execute `expressions` before sending heredoc
ssh bjvm "bash -s" <<`EOF`

# Make sure our nginx config is for the correct servername
sed -i 's/server_name .*;/server_name `hostname`;/' /etc/nginx/nginx.conf

nginx -t
if [[ $? -eq 0 ]]
then
  systemctl reload nginx
  systemctl status nginx
else
  echo "Syntax error in nginx.conf"
fi

`EOF`

