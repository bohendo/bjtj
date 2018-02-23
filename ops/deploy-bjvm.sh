#!/bin/bash

export BJVM_ETHPROVIDER="/tmp/ipc/geth.ipc"

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

  nginx:
    image: $me/bjvm_nginx:$v
    depends_on:
      - nodejs
    deploy:
      mode: global
    ports:
      - "80:80"
    networks:
      - front

EOF

docker stack deploy -c /tmp/bjvm/docker-compose.yml bjvm

