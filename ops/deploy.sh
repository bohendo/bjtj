#!/bin/bash

# Expects cwd to be the project root
[ -d ops ] && [ -f ops/deploy.sh ] || exit 1

if [ -z "$1" ]
then
  target='localhost'
  bash ops/secret-init.sh
  docker stack deploy -c docker-compose.yml bjvm
else
  target="$1"
  ssh $target 'bash -s' < ops/secret-init.sh
  scp docker-compose.yml "$target:~/docker-compose.yml"
  ssh $target docker stack deploy -c docker-compose.yml bjvm
fi


