#!/bin/bash

function err { >&2 echo "Error: $1"; exit 1; }

# Expects cwd to be the project root
[ -d ops ] && [ -f ops/deploy.sh ] || exit 1

if ! ssh -q $1 exit 2> /dev/null
then
  err "Couldn't open an ssh connection to $1"
fi

make && make deploy

v=$(grep "\"version\"" ./package.json | egrep -o [0-9.]*)

cat ops/compose-prod.yml | sed 's/$v/'"$v"'/g' | ssh $1 "cat - > ~/docker-compose.yml"

ssh $1 'bash -s' < ops/secret-init.sh

ssh $1 docker pull bohendo/bjvm_mongo:$v
ssh $1 docker pull bohendo/bjvm_nodejs:$v
ssh $1 docker pull bohendo/bjvm_nginx:$v
ssh $1 docker pull bohendo/bjvm_certbot:$v

ssh $1 docker stack deploy -c docker-compose.yml bjvm

