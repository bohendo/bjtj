#!/bin/sh

if [ ! -f /run/secrets/mongo_user ]
then
  echo "OH NO CANT FIND MY SECRET"
  ls /
  ls /run
  ls /run/secrets
fi

exec node /root/server.bundle.js
