#!/bin/sh

if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME 2> /dev/null
then
  echo "Found HTTPS certs for $BJVM_DOMAINNAME, renewing if necessary..."
  certbot renew

else
  echo "No HTTPS certs found, initializing certs for $BJVM_DOMAINNAME..."
  certbot certonly --webroot -m $BJVM_EMAIL --agree-tos --no-eff-email -w /var/www/letsencrypt/ -d $BJVM_DOMAINNAME

fi

