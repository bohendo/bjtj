#!/bin/sh

# Already initialized? Then we're good to go
if [ -d /data/db/diagnostic.data ]
then
  exec mongod -f /etc/mongo.conf
fi

# Prepare to use our secrets in a here doc
admin_pwd=`cat /run/secrets/admin`
user_pwd=`cat /run/secrets/mongo`

# Start mongod for the very first time w/out auth
mongod &

# Wait until mongod is ready to roll
cat > /root/wait_for_mongo.js <<EOF
var conn;
var startTime = new Date();
while(conn === undefined) {
  try {
    print("Attempting to connect to mongo, elapsed: " + (new Date() - startTime)/1000 + "s");
    conn = new Mongo();
  } catch(error) {
    print(error);
    sleep(1000);
  }
}
print("MongoDB connection established in " + (new Date() - startTime)/1000 + "s");
EOF
mongo --nodb /root/wait_for_mongo.js

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

