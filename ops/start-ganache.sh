#!/bin/bash

image="trufflesuite/ganache-cli:latest"

docker pull $image

if [[ "$1" == "local" ]]
then

  ganache-cli \
    --mnemonic "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" \
    --networkId "5777" \
    --gasLimit "12000000" \
    --port "8545"
else

  docker service create \
    --name "ethprovider_ganache" \
    --mode "global" \
    --network "blog_back" \
    --publish "8545:8545" \
    --mount "type=volume,source=ganache_data,target=/root/ganache" \
    --detach \
    $image node ./build/cli.node.js \
    --mnemonic "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" \
    --networkId "5777" \
    --gasLimit "12000000" \
    --db "/root/ganache" \
    --port "8545"

fi

