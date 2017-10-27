#!/bin/sh

if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME 2> /dev/null
then
  echo "Found HTTPS certs for $BJVM_DOMAINNAME, renewing if necessary..."
  exec certbot renew

elif [ $BJVM_DOMAINNAME == 'localhost' ]
then
  echo "Exiting, no certs needed for $BJVM_DOMAINNAME..."

else
  echo "No HTTPS certs found, initializing certs for $BJVM_DOMAINNAME..."
  exec certbot certonly --webroot -m $BJVM_EMAIL --agree-tos --no-eff-email -w /var/www/letsencrypt/ -d $BJVM_DOMAINNAME

fi

