#!/bin/sh

if [ "$NODE_ENV" == "production" ]
then
  exec node /root/nodejs.bundle.js
else
  exec nodemon --exitcrash --watch /root/nodejs.bundle.js /root/nodejs.bundle.js
fi
