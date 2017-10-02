#!/bin/bash

scp nginx.conf root@$IP:/etc/nginx/nginx.conf

ssh root@$IP sed -i 's/server_name .*;/server_name '`hostname`';/' /etc/nginx/nginx.conf

########################################
# Configure nginx

# We scp'ed stuff to ~ so it should be here

mv -f nginx.conf /etc/nginx/nginx.conf

nginx -t
if [[ $? -eq 0 ]]
then
  systemctl reload nginx
else
  echo "Syntax error in nginx.conf"
fi


`EOF`

if [[ ! `git branch --list live` ]]
then
  git remote add live ssh://git@$IP:/var/git/live.git
fi

echo;echo "We're good to go, git push to live whenever you're ready to deploy.";

