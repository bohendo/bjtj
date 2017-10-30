#!/bin/sh

echo "Starting node with NODE_ENV=$NODE_ENV"

if [ "$NODE_ENV" == 'production' ]
then
  exec node /root/server.bundle.js
else
  exec nodemon -w /root/server.bundle.js /root/server.bundle.js
fi

