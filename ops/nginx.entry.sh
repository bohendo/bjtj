#!/bin/sh

# Set default env vars
echo "env: DOMAINNAME=$DOMAINNAME EMAIL=$EMAIL"
[ -n "$DOMAINNAME" ] || export DOMAINNAME=localhost
[ -n "$EMAIL" ] || export EMAIL=nothankyou@example.com
echo "env: DOMAINNAME=$DOMAINNAME EMAIL=$EMAIL"

mkdir -p /etc/certs

# If letsencrypt is providing certs, use those
if ls /etc/letsencrypt/live/$DOMAINNAME/privkey.pem 2> /dev/null
then
  echo "Found letsencrypt certs for $DOMAINNAME, using those"
  ln -sf /etc/letsencrypt/live/$DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem

# If I loaded devcerts, use those
elif ls /etc/devcerts/site.key 2> /dev/null
then
  echo "Found dev certs for $DOMAINNAME, using those"
  ln -sf /etc/devcerts/site.key /etc/certs/privkey.pem
  ln -sf /etc/devcerts/site.crt /etc/certs/fullchain.pem

# Otherwise, use certbot to get new certs
else
  echo "Couldn't find certs for $DOMAINNAME, initializing those now.."

  certbot certonly --standalone -m $EMAIL --agree-tos --no-eff-email -d $DOMAINNAME -n
  [ $? -eq 0 ] || sleep 9999 # Take a sec to debug before we try again..

  ln -sf /etc/letsencrypt/live/$DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem
  echo "Done initializing certs, starting nginx..."

fi

sed -i 's/$hostname/'"$DOMAINNAME"'/' /etc/nginx/nginx.conf

cat /etc/nginx/nginx.conf

renewcerts() {
  while true
  do
    echo -n "Preparing to renew certs... "
    if ls /etc/letsencrypt/live/$DOMAINNAME &> /dev/null
    then
      echo -n "Found certs to renew for $DOMAINNAME... "
      certbot renew --webroot -w /var/www/letsencrypt/ -n
      echo "Done!"
    fi
    echo "No certs found, Done!"
    sleep 48h
  done
}
renewcerts &

exec nginx
