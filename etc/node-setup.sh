#!/bin/bash

# define a clean error handler
function err { >&2 echo "Error: $1"; exit 1; }

# Sanity check: can we even ssh to the server we're setting up?
ssh -q bjvm exit
if [[ $? -ne 0 ]]; then err "can't ssh to bjvm, did you initialize this droplet?"; fi

ssh bjvm "bash -s" <<EOF

if ! hash node 2> /dev/null; then
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt install -y nodejs
fi

EOF

