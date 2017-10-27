#!/bin/sh

# a cleaner error handler
function err { >&2 echo "Error: $1"; exit 1; }

[ -f /run/secrets/mongo_admin ] || err 'Need mongo_admin secret'
[ -f /run/secrets/mongo_user ]  || err 'Need mongo_user secret'

admin_pwd=`cat /run/secrets/mongo_admin`
user_pwd=`cat /run/secrets/mongo_user`

# Already initialized? No further action needed
if [ -d /data/db/diagnostic.data ]
then
  exec mongod -f /etc/mongo.conf
  exit 1 # we shouldn't ever reach this exit
fi

# Start mongod for the very first time w/out auth
mongod & sleep 10 # give it a sec to get going

# Setup auth & our bjvm db/user
mongo <<EOF
use admin
db.createUser({
  user: 'admin', pwd: '$admin_pwd',
  roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
})
use bjvm
db.createUser( {
  user: 'bjvm', pwd: '$user_pwd',
  roles: [ { role: 'readWrite', db: 'bjvm' } ]
})
use admin
db.shutdownServer()
EOF

# Alright, start mongod for real now
exec mongod -f /etc/mongo.conf
exit 1 # we shouldn't ever reach this exit
