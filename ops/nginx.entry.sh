#!/bin/sh

# If letsencrypt is providing real certs, use those
if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem 2> /dev/null
then
  echo "Found certs for $BJVM_DOMAINNAME, using those"
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem

# Otherwise use a self-signed cert just so nginx doesn't crash
else
  echo "WARNING: Couldn't find certs for $BJVM_DOMAINNAME, using self-signed ones for now.."
  ln -sf /etc/certs/backup.key /etc/certs/privkey.pem
  ln -sf /etc/certs/backup.crt /etc/certs/fullchain.pem
fi

nginx

