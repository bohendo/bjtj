#!/bin/sh

if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME 2> /dev/null
then
  echo "Found HTTPS certs for $BJVM_DOMAINNAME, exiting..."
  exit

elif [ $BJVM_DOMAINNAME == 'localhost' ]
then
  echo "No certs needed for $BJVM_DOMAINNAME, exiting..."
  exit

else
  echo "No HTTPS certs found, initializing certs for $BJVM_DOMAINNAME..."
  exec certbot certonly --standalone --preferred-challenges http -m $BJVM_EMAIL --agree-tos --no-eff-email -d $BJVM_DOMAINNAME

fi

