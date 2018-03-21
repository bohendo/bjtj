#!/bin/bash

docker service rm bjtj

make deploy

bash ops/deploy.sh

docker service logs -f bjtj
