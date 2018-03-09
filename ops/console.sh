#!/bin/bash

dealer="`pwd`/dealer.js"

if [[ -f "$dealer" ]]
then
  echo "Bind mounting $dealer"
  bind="-v $dealer:/root/dealer.js"
fi

docker run -it -v ethprovider_ipc:/tmp/ipc $bind ethereum/client-go attach /tmp/ipc/geth.ipc --preload /root/dealer.js
