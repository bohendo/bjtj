#!/bin/bash

########################################
# Setup environment

set -e

NODE_ENV="development"
ETH_PROVIDER="/tmp/ipc/geth.ipc"

if [[ -z "$ETH_ADDRESS" ]]
then
  echo "Set an ETH_ADDRESS environment variable first"
  exit 1
fi

me=`whoami` # docker.io username
v=latest

########################################
# Setup bind mounts for easy development
if [[ "$NODE_ENV" == "development" ]]
then

  serverbundle="`pwd`/build/server.bundle.js"
  if [[ -f "$serverbundle" ]]
  then
    bindserver="--mount=type=bind,source=$serverbundle,destination=/root/server.bundle.js"
  fi

  clientbundle="`pwd`/build/static/client.bundle.js"
  if [[ -f "$clientbundle" ]]
  then
    bindclient="--mount=type=bind,source=$clientbundle,destination=/root/static/client.bundle.js"
  fi
fi

########################################
# Pull updated images

docker pull "$me/bjvm:$v"
docker service create \
  --name="bjvm" \
  --mode="global" \
  --secret="$ETH_ADDRESS" \
  --secret="wp_mysql" \
  --network="blog_front" \
  --network="blog_back" \
  --mount="type=volume,source=ethprovider_ipc,destination=/tmp/ipc" \
  $bindserver \
  $bindclient \
  --env="NODE_ENV=$NODE_ENV" \
  --env="ETH_PROVIDER=$ETH_PROVIDER" \
  --env="ETH_ADDRESS=$ETH_ADDRESS" \
  --publish="3000:3000" \
  --detach \
  "$me/bjvm:$v"

