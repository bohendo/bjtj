#!/bin/sh

if [ "$NODE_ENV" == "production" ]
then
  exec node /root/server.bundle.js
else
  exec nodemon --exitcrash --watch /root/server.bundle.js /root/server.bundle.js
fi
