#!/bin/bash

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check, were we given a hostname?
if [[ ! $1 || $2 ]]; then err "Provide droplet's domain name as the first & only arg"; fi
dn=$1
email=`git config user.email || echo user@example.com`

docker run \
  -it      \
  -v webroot:/var/www/letsencrypt/ \
  -v letsencrypt:/etc/letsencrypt/ \
  certbot/certbot certonly  \
    --webroot               \
    -m $email               \
    --agree-tos             \
    --no-eff-email          \
    -d $dn                  \
    -w /var/www/letsencrypt \
    --dry-run

