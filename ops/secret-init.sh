#!/bin/bash

secrets=("mongo_admin" "mongo_user")

for sec in "${secrets[@]}"
do
  echo -n "Looking for $sec...   "

  if [[ ! `docker secret ls -f name=$sec -q` ]]
  then
    echo -n "Don't see it, initializing...   "
    head -c30 /dev/urandom | base64 | docker secret create $sec - > /dev/null
    echo "Done!"
  else
    echo "Found $sec, Done!"
  fi

done

echo "Done initializing secrets!"

