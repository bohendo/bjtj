#!/bin/bash

########################################
# Set some important variables

me=`whoami` # docker.io username
v=latest

[[ -n "$DOMAINNAME" ]] || DOMAINNAME=localhost
[[ -n "$EMAIL" ]] || EMAIL=nothanks@example.com

########################################
echo "Deploying blog in environment: me=$me v=$v DOMAINNAME=$DOMAINNAME EMAIL=$EMAIL"
sleep 1

# Initialize docker secrets
secrets="wp_mysql wp_mysql_root wp_auth_key wp_secure_auth_key wp_logged_in_key wp_nonce_key wp_auth_salt wp_secure_auth_salt wp_logged_in_salt wp_nonce_salt"
for secret in $secrets
do
  if [[ -z "`docker secret ls -qf name=$secret`" ]]
  then
    id=`head -c27 /dev/urandom | base64 | tr -d '\n\r' | docker secret create $secret -`
    echo "Created new secret: $secret with id $id"
  fi
done

# Make sure local dev files are available to be bind-mounted
if [[ ! -f "./php/bjtj.php" || ! -f "./build/static/client.bundle.js" ]]
then
  echo 'bjtj source files are missing..'
  exit 1
fi

# Specify & update docker images
proxy="$me/blog_proxy:$v"
wordpress="$me/blog_wordpress:$v"

docker pull $proxy
docker pull $wordpress

mkdir -p /tmp/blog
cat -> /tmp/blog/docker-compose.yml <<EOF
version: '3.4'

networks:
  front:
  back:

volumes:
  wp_data:
  mysql_data:
  letsencrypt:
  devcerts:

secrets:
  wp_mysql:
    external: true
  wp_mysql_root:
    external: true
  wp_auth_key:
    external: true
  wp_secure_auth_key:
    external: true
  wp_logged_in_key:
    external: true
  wp_nonce_key:
    external: true
  wp_auth_salt:
    external: true
  wp_secure_auth_salt:
    external: true
  wp_logged_in_salt:
    external: true
  wp_nonce_salt:
    external: true

services:

  proxy:
    image: $proxy
    deploy:
      mode: global
    depends_on:
      - wordpress
      - mysql
    networks:
      - front
    volumes:
      - devcerts:/etc/devcerts
      - letsencrypt:/etc/letsencrypt
    environment:
      - DOMAINNAME=$DOMAINNAME
      - EMAIL=$EMAIL
    ports:
      - "80:80"
      - "443:443"

  wordpress:
    image: $wordpress
    deploy:
      mode: global
    depends_on:
      - mysql
    networks:
      - front
      - back
    volumes:
      - wp_data:/var/www/wordpress
      - `pwd`/php:/tmp/bjtj
      - `pwd`/build/static/client.bundle.js:/tmp/bjtj/js/client.bundle.js
    secrets:
      - wp_mysql
      - wp_auth_key
      - wp_secure_auth_key
      - wp_logged_in_key
      - wp_nonce_key
      - wp_auth_salt
      - wp_secure_auth_salt
      - wp_logged_in_salt
      - wp_nonce_salt
    environment:
      - WORDPRESS_DB_USER=wordpress
      - WORDPRESS_DB_PASSWORD_FILE=/run/secrets/wp_mysql
      - WORDPRESS_DB_HOST=mysql:3306
      - WORDPRESS_DB_NAME=wordpress

  mysql:
    image: mysql:5
    deploy:
      mode: global
    networks:
      - back
    volumes:
      - mysql_data:/var/lib/mysql
    secrets:
      - wp_mysql
      - wp_mysql_root
    environment:
      - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/wp_mysql_root
      - MYSQL_PASSWORD_FILE=/run/secrets/wp_mysql
      - MYSQL_USER=wordpress
      - MYSQL_DATABASE=wordpress
EOF

docker stack deploy -c /tmp/blog/docker-compose.yml blog
rm /tmp/blog/docker-compose.yml
