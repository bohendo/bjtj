#!/bin/bash

########################################
# Sanity Check: can we ssh to bjvm?

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

ssh -q bjvm exit
if [[ $? -ne 0 ]]; then err "Couldn't open an ssh connection to bjvm (have you run setup-droplet.sh?)"; fi

# Load our config file into memory
nginx=`cat nginx.conf`

########################################
# Tweak config files and reload services

# `ticks` around delimiter means don't execute `expressions` before sending heredoc
ssh bjvm "bash -s" <<`EOF`

# Keep a copy juuust in case
mv -f /etc/nginx/nginx.conf /etc/nginx/.nginx.conf.backup

echo "$nginx" |\
sed 's/server_name .*;/server_name '`hostname`';/' \
> /etc/nginx/nginx.conf

nginx -t
if [[ $? -eq 0 ]]
then
  systemctl restart nginx
  systemctl status nginx
else
  echo "Syntax error in nginx.conf"
fi

`EOF`

