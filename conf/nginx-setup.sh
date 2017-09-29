#!/bin/bash

etc="$HOME/Dropbox/Documents/etc"

sudo cp --remove-destination "$etc/nginx.conf" "/etc/nginx/nginx.conf"

sudo nginx -t 2> /dev/null
if [[ $? -eq 0 ]]; then
  sudo systemctl reload nginx
  sudo systemctl status nginx
else
  echo "Syntax error in nginx.conf"
fi

