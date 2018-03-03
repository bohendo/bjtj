#!/bin/bash

image="trufflesuite/ganache-cli:latest"

docker pull $image

docker service create \
  --name "ethprovider_ganache" \
  --mode "global" \
  --publish "8545:8545" \
  --detach \
  $image \
  node ./build/cli.node.js \
  --mnemonic "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" \
  --networkId "5777"

