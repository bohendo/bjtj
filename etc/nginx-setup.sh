#!/bin/bash

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check: can we even ssh to the server we're setting up?
ssh -q bjvm exit
if [[ $? -ne 0 ]]; then err "can't ssh to bjvm, did you initialize this droplet?"; fi

dir=`dirname "$(readlink -f "$0")"`

scp "$dir/nginx.conf" bjvm:~

email=`git config user.email`

ssh bjvm "bash -s" <<`EOF`


## Install nginx if it's not installed already
if ! hash nginx 2> /dev/null; then
  sudo apt-get update -y
  sudo apt-get upgrade -y
  sudo apt-get install nginx -y
fi

sed -i 's/server_name .*;/server_name '`hostname`';/' nginx.conf
# sudo mv -f nginx.conf /etc/nginx/nginx.conf

echo `hostname`
exit

## Install certbot if it's not installed already
if ! hash certbot 2> /dev/null; then
  sudo add-apt-repository ppa:certbot/certbot -y
  sudo apt-get update -y
  sudo apt-get install python-certbot-nginx -y

  sudo certbot --nginx -d `hostname` <<EOIF
$email
A
N
2
EOIF

  sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
  sudo sed -i '0,/# managed by Certbot/ s/.*# managed by Certbot/        ssl_dhparam \/etc\/ssl\/certs\/dhparam.pem;\n&/' /etc/nginx/nginx.conf
else
  sudo certbot --nginx -d `hostname` install
fi

# Set appropriate permissions

sudo nginx -t 2> /dev/null
if [[ $? -eq 0 ]]; then
  sudo systemctl reload nginx
  sudo systemctl status nginx
else
  echo "Syntax error in nginx.conf"
fi

`EOF`

