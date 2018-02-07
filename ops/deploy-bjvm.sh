#!/bin/bash

mkdir -p /tmp/bjvm

secrets=("admin" "mongo")

for sec in "${secrets[@]}"
do
  echo -n "Looking for $sec... "
  if [[ -z "`docker secret ls | awk '{print$2}' | egrep "^$sec$"`" ]]
  then
    echo -n "Don't see it, initializing... "
    head -c30 /dev/urandom | base64 | tr -d '\n\r ' | docker secret create $sec - > /dev/null
    echo "Done!"
  else
    echo "Found $sec, Done!"
  fi

done

echo "Done initializing secrets!"

#v=$(grep "\"version\"" ./package.json | egrep -o [0-9.]*)
v=latest

#docker pull bohendo/bjvm_mongo:$v
#docker pull bohendo/bjvm_nodejs:$v
#docker pull bohendo/bjvm_nginx:$v

export BJVM_ETHPROVIDER="$BJVM_ETHPROVIDER"
export BJVM_ETHID="$BJVM_ETHID"

cat -> /tmp/bjvm/docker-compose.yml <<EOF

version: '3.4'

networks:
  front:
  back:

volumes:
  letsencrypt:
  webroot:
  devcerts:
  mongodb:

secrets:
  admin:
    external: true
  mongo:
    external: true

services:

  mongo:
    image: bohendo/bjvm_mongo:latest
    deploy:
      mode: global
    networks:
      - back
    volumes:
      - mongodb:/data/db
    secrets:
      - admin
      - mongo

  node:
    image: bohendo/bjvm_nodejs:$v
    environment:
      - NODE_ENV=production
      - BJVM_ETHPROVIDER=$BJVM_ETHPROVIDER
      - BJVM_ETHID=$BJVM_ETHID
    depends_on:
      - mongo
    deploy:
      mode: global
    networks:
      - front
      - back
    secrets:
      - mongo

  nginx:
    image: bohendo/bjvm_nginx:$v
    environment:
      - BJVM_DOMAINNAME=$BJVM_DOMAINNAME
      - BJVM_EMAIL=$BJVM_EMAIL
    depends_on:
      - nodejs
    deploy:
      mode: global
    hostname: $BJVM_DOMAINNAME
    volumes:
      - devcerts:/etc/devcerts/
    ports:
      - "80:80"
      - "443:443"
    networks:
      - front

EOF

docker stack deploy -c /tmp/bjvm/docker-compose.yml bjvm

