#!/bin/sh

# If letsencrypt is providing real certs, use those
if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem 2> /dev/null
then
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem

# Otherwise use a self-signed cert just so nginx doesn't crash
else
  ln -sf /etc/certs/backup.key /etc/certs/privkey.pem
  ln -sf /etc/certs/backup.crt /etc/certs/fullchain.pem
fi

nginx

