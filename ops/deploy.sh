#!/bin/bash

# Expects cwd to be the project root
[ -d ops ] && [ -f ops/deploy.sh ] || exit 1

if [ -z "$1" ]
then
  target='localhost'
  docker stack deploy -c docker-compose.yml bjvm
else
  target="$1"
  scp docker-compose.yml "$target:~/docker-compose.yml"
  ssh $target docker stack deploy -c docker-compose.yml bjvm
fi


