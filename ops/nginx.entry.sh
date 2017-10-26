#!/bin/sh

# If letsencrypt is providing certs, use those
if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem 2> /dev/null
then
  echo "Found letsencrypt certs for $BJVM_DOMAINNAME, using those"
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem

# If I loaded fallback certs (ie for development), use those
elif ls /etc/fallback/site.key 2> /dev/null
then
  echo "Found fallback certs for $BJVM_DOMAINNAME, using those"
  ln -sf /etc/fallback/site.key /etc/certs/privkey.pem
  ln -sf /etc/fallback/site.crt /etc/certs/fullchain.pem

# Otherwise generate a self-signed cert just so nginx doesn't crash
else
  echo "WARNING: Couldn't find certs for $BJVM_DOMAINNAME, using self-signed ones for now.."

  # initialize a placeholder cert
  openssl req \
    -newkey rsa:2048 -nodes -keyout /etc/certs/privkey.pem \
    -x509 -days 365 -out /etc/certs/fullchain.pem \
    -subj "/C=/ST=/L=/O=/OU=/CN=/"

fi

nginx

