#!/bin/sh

if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME 2> /dev/null
then
  echo "Found HTTPS certs for $BJVM_DOMAINNAME, renewing if necessary..."
  exec certbot renew --webroot -w /var/www/letsencrypt/ -n

elif [ $BJVM_DOMAINNAME == 'localhost' ]
then
  echo "No certs to renew for $BJVM_DOMAINNAME, exiting..."
  exit

else
  echo "No HTTPS certs found, exiting..."
  exit

fi

