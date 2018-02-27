#!/bin/bash

########################################
# Setup environment

set -e

export ETH_PROVIDER="/tmp/ipc/geth.ipc"
export NODE_ENV="development"

me=`whoami` # docker.io username
v=latest

########################################
# Initialize docker secrets
secrets="wp_mysql"
for secret in $secrets
do
  if [[ -z "`docker secret ls -qf name=$secret`" ]]
  then
    id=`head -c27 /dev/urandom | base64 | tr -d '\n\r' | docker secret create $secret -`
    echo "Created new secret: $secret with id $id"
  fi
done

########################################
# Setup bind mount for easy development
bundle="`pwd`/build/server.bundle.js"
if [[ "$NODE_ENV" == "development" && -f "$bundle" ]]
then
  bindmount="- $bundle:/root/server.bundle.js"
fi

########################################
# Pull updated images
nodejs="$me/bjvm_nodejs:$v"
docker pull $nodejs

########################################
# Create a docker-compose.yml & deploy
mkdir -p /tmp/bjvm
cat -> /tmp/bjvm/docker-compose.yml <<EOF
version: '3.4'

networks:
  blog_back:
    external: true

volumes:
  ethprovider_ipc:
    external: true

secrets:
  wp_mysql:
    external: true

services:

  nodejs:
    image: $nodejs
    environment:
      - NODE_ENV=$NODE_ENV
      - ETH_PROVIDER=$ETH_PROVIDER
      - ETH_ADDRESS=$ETH_ADDRESS
    deploy:
      mode: global
    networks:
      - blog_back
    secrets:
      - wp_mysql
    ports:
      - "3000:3000"
    volumes:
      - ethprovider_ipc:/tmp/ipc
      $bindmount

EOF

docker stack deploy -c /tmp/bjvm/docker-compose.yml bjvm
rm -rf /tmp/bjvm

