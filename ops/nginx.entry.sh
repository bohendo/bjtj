#!/bin/sh

# If letsencrypt is providing certs, use those
if ls /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem 2> /dev/null
then
  echo "Found letsencrypt certs for $BJVM_DOMAINNAME, using those"
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem

# If I loaded devcerts, use those
elif ls /etc/devcerts/site.key 2> /dev/null
then
  echo "Found dev certs for $BJVM_DOMAINNAME, using those"
  ln -sf /etc/devcerts/site.key /etc/certs/privkey.pem
  ln -sf /etc/devcerts/site.crt /etc/certs/fullchain.pem

# Otherwise, use certbot to get new certs
else
  echo "Couldn't find certs for $BJVM_DOMAINNAME, initializing those now.."
  echo "certbot certonly --standalone -m $BJVM_EMAIL --agree-tos --no-eff-email -d $BJVM_DOMAINNAME -n"

  certbot certonly --standalone -m $BJVM_EMAIL --agree-tos --no-eff-email -d $BJVM_DOMAINNAME -n
  [ $? -eq 0 ] || sleep 9999 # Take a sec to debug before we try again..

  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$BJVM_DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem
  echo "Done initializing certs, starting nginx..."

fi

sed -i 's/$hostname/'"$BJVM_DOMAINNAME"'/' /etc/nginx/nginx.conf
cat /etc/nginx/nginx.conf

# TODO: wait until node is alive

exec nginx

