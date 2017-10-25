#!/bin/sh

if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME 2> /dev/null
then
  echo "No HTTPS certs year, initializing certs for $BJVM_DOMAINNAME..."
  certbot renew --dry-run

else
  echo "Found HTTPS certs for $BJVM_DOMAINNAME, renewing if necessary..."
  certbot certonly --webroot -m $BJVM_EMAIL --agree-tos --no-eff-email -w /var/www/letsencrypt/ -d $BJVM_DOMAINNAME --dry-run

fi

