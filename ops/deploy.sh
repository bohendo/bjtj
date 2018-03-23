#!/bin/bash

########################################
# Setup environment

set -e

NODE_ENV="development"
ETH_PROVIDER="/tmp/ipc/parity.ipc"

me=`whoami` # docker.io username
v=latest


########################################
# Check & setup the ETH_ADDRESS we're deploying with

if [[ "$NODE_ENV" == "development" ]]
then
  ETH_ADDRESS="0x627306090abab3a6e1400e9345bc60c78a8bef57"
  if [[ -z "`docker secret ls -q -f name=$ETH_ADDRESS`" ]]
  then
    id=`echo 'ganache' | tr -d '\n\r' | docker secret create $ETH_ADDRESS -`
    echo "Created docker secret $ETH_ADDRESS with id $id"
  fi
fi

# Make sure it's been exported externally in production
if [[ -z "$ETH_ADDRESS" ]]
then
  echo "Set an ETH_ADDRESS environment variable first"
  exit 1
fi


########################################
# Setup bind mounts for easy development
if [[ "$NODE_ENV" == "development" ]]
then

  nodejsbundle="`pwd`/build/nodejs.bundle.js"
  if [[ -f "$nodejsbundle" ]]
  then
    bindnodejs="--mount=type=bind,source=$nodejsbundle,destination=/root/nodejs.bundle.js"
  fi

  clientbundle="`pwd`/build/static/client.bundle.js"
  if [[ -f "$clientbundle" ]]
  then
    bindclient="--mount=type=bind,source=$clientbundle,destination=/root/static/client.bundle.js"
  fi
fi

########################################
# Pull updated images

docker pull "$me/bjtj:$v"
docker service create \
  --name="bjtj" \
  --mode="global" \
  --secret="$ETH_ADDRESS" \
  --secret="wp_mysql" \
  --network="blog_front" \
  --network="blog_back" \
  --mount="type=volume,source=ethprovider_ipc,destination=/tmp/ipc" \
  $bindnodejs \
  $bindclient \
  --env="NODE_ENV=$NODE_ENV" \
  --env="ETH_PROVIDER=$ETH_PROVIDER" \
  --env="ETH_ADDRESS=$ETH_ADDRESS" \
  --publish="3000:3000" \
  --detach \
  "$me/bjtj:$v"

