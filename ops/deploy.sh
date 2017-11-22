#!/bin/bash

function err { >&2 echo "Error: $1"; exit 1; }

# Make sure the cwd is where it should be
[ -d ops ] && [ -f package.json ] || err 'Deploy from the project root'

# Don't deploy if we're on master
branch=`git rev-parse --abbrev-ref HEAD`
if [[ ${branch:0:7} != 'release' ]]
then
  err "Don't deploy this branch, that's what release branches are for"
fi

# Don't deploy if there are uncommitted changes
if [[ `git status --short | wc -l` -ne 0 ]]
then
  err "Commit your changes first"
fi

# Make sure we can ssh to the machine we're deploying to
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

ssh $1 'bash -s' <<EOF
export BJVM=ETHID="$BJVM_ETHID"
docker stack deploy -c docker-compose.yml bjvm
EOF

