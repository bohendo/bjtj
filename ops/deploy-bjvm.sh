#!/bin/bash

export BJVM_ETHPROVIDER="/tmp/ipc/geth.ipc"
export NODE_ENV="development"

bundle="`pwd`/build/server.bundle.js"
if [[ "$NODE_ENV" == "development" && -f "$bundle" ]]
then
  bindmount="- $bundle:/root/server.bundle.js"
fi

me=`whoami` # docker.io username
v=latest

secrets="bjvm_mysql bjvm_mysql_root"
for secret in $secrets
do
  if [[ -z "`docker secret ls -qf name=$secret`" ]]
  then
    id=`head -c27 /dev/urandom | base64 | tr -d '\n\r' | docker secret create $secret -`
    echo "Created new secret: $secret with id $id"
  fi
done

#docker pull $me/bjvm_mongo:$v
#docker pull $me/bjvm_nodejs:$v
#docker pull $me/bjvm_nginx:$v

mkdir -p /tmp/bjvm
cat -> /tmp/bjvm/docker-compose.yml <<EOF
version: '3.4'

networks:
  front:
  back:

volumes:
  mysql_data:
  ethprovider_ipc:
    external: true

secrets:
  bjvm_mysql:
    external: true
  bjvm_mysql_root:
    external: true

services:

  nodejs:
    image: $me/bjvm_nodejs:$v
    environment:
      - NODE_ENV=production
      - BJVM_ETHPROVIDER=$BJVM_ETHPROVIDER
    deploy:
      mode: global
    networks:
      - front
      - back
    secrets:
      - bjvm_mysql
    volumes:
      - ethprovider_ipc:/tmp/ipc
      $bindmount

  nginx:
    image: $me/bjvm_nginx:$v
    depends_on:
      - nodejs
    deploy:
      mode: global
    ports:
      - "8081:80"
    networks:
      - front

  mysql:
    image: mysql:5
    deploy:
      mode: global
    networks:
      - back
    volumes:
      - mysql_data:/var/lib/mysql
    secrets:
      - bjvm_mysql
      - bjvm_mysql_root
    environment:
      - MYSQL_ROOT_PASSWORD_FILE=/run/secrets/bjvm_mysql_root
      - MYSQL_PASSWORD_FILE=/run/secrets/bjvm_mysql
      - MYSQL_USER=wordpress
      - MYSQL_DATABASE=wordpress

EOF
cat /tmp/bjvm/docker-compose.yml

docker stack deploy -c /tmp/bjvm/docker-compose.yml bjvm

