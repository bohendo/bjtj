#!/bin/bash

########################################
# Sanity Check: can we ssh to bjvm?

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given a domain name?
if [[ ! $1 || $2 ]]; then err "Provide droplet's domain name as the first & only arg"; fi
DN=$1

ssh -q bjvm exit
if [[ $? -ne 0 ]]; then err "Couldn't open an ssh connection to bjvm (have you run setup-droplet.sh?)"; fi

email=`git config user.email`

ssh bjvm "bash -s" <<EOF

sed -i 's/server_name .*;/server_name '$DN';/' /etc/nginx/nginx.conf

# Request and install an https certificate
certbot --nginx -d $DN -m $email --agree-tos --no-eff-email -n

if [[ ! -f /etc/ssl/certs/dhparam.pem ]]
then
  openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
fi

if ! grep ssl_dhparam /etc/nginx/nginx.conf
then
  sed -i '0,/# managed by Certbot/ s/.*# managed by Certbot/        ssl_dhparam \/etc\/ssl\/certs\/dhparam.pem;\n&/' /etc/nginx/nginx.conf
fi

if nginx -t
then
  systemctl restart nginx
  systemctl status nginx
fi

EOF

