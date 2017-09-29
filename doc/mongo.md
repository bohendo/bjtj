
# Mongo

### By Bo Henderson
### Created on Jan 15, 2017
### Updated on Sep 18, 2017

## Resources
 1. [Installing Mongo on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
 2. [Mongo security checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
 3. [Little Mongo Book (66 pgs)](http://openmymind.net/mongodb.pdf)
 4. [Mongo config file reference](https://docs.mongodb.com/manual/reference/configuration-options/)

## Installation

This baby installation script worked on Sep 19, 2017. Check resource 1 for an update if this was a long time ago.

```bash
# Get the mongo team's keys
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

# Add the mongo team's repo to our apt sources
echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

# Install Mongo
sudo apt-get update -y && sudo apt-get install -y mongodb-org

# Confirm it all worked
mongod --version
# should output "db version v3.4.2" followed by some other details
```

A few notes:

 - Configuration file: `/etc/mongod.conf`
 - Data stored in: `/var/lib/mongodb/`
 - Log files stored in: `/var/log/mongodb`
 - Default port: `27017`

Get up and running like so:

```bash
# Start db server in background
sudo mongod &

# Connect to db server
mongo
```

# Enable Authentication

By default, every mongo user has root access to all databases.. Not such a secure situation. We'll turn authentication on but first we need to create a password-protected user.

```javascript
// Admin database presides over all other databases
// it's very important that we set up our admin user here
use admin

// the mongo shell is a also a javascript shell
// so you can assign variables, create helper functions, etc
var username = "admin"
var password = "Passw0rd";

db.createUser(
  {
    user: username,
    pwd: password,
    roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]
  }
)

db.shutdownServer()
exit
```

If `db.shutdownServer()` doesn't do the job you can use this more direct way of killing the mongo process:

```bash
sudo kill `ps -e | grep mongod | egrep "[0-9]+" -o | head -n 1`
```

And now we'll restart it with authentication enabled. Later we'll move the auth option and many others into the config file but for now we'll use command line arguments.

```bash
sudo mongod --auth &
mongo
```

Authentication is enabled now, let's test it out.

```javascript
// don't forget to switch to the admin database while doing admin tasks 
use admin

// Try logging in as our admin use. Success will print 1.
db.auth({user: 'admin', pwd: "Passw0rd"})

// IMPORTANT: admins can only access database/user metadata 
// Admins can't read or write the actual data but that's expected, don't worry
// Admins can create someone who can read & write data, let's do that.

// create a bohendo database to store data from bohendo.com
use bohendo

// substitute your own credentials if you like
var username = 'bohendo';
var password = 'Passw0rd';

// create a reader/writer for this database
db.createUser(
  {
    user: username,
    pwd: password,
    roles: [ { role: 'readWrite', db: 'bohendo' } ]
  }
)
db.auth({user: username, pwd: password})

db.bodycomp.insert({"weight": 158, "bodyfat": 9.5})
db.bodycomp.find();
```

Cool, now our bohendo user can modify this database but no one else can.. Not even the admin. Much more secure than how we started.

Here are some references for [user](https://docs.mongodb.com/manual/reference/command/nav-user-management/) and [role](https://docs.mongodb.com/manual/reference/command/nav-role-management/) management commands in case you want to set up something more complicated than one database and one user.

## Harden config file

Here's what my config file looks like:

```yaml
systemLog:
  # number 0-5 with 5 being the most verbose	
  verbosity: 0
  # false: create new logfile on restart rather than continuing to append to the old one
  logAppend: false
  # vs 'reopen' which uses logrotate utility to rename logfiles for us
  logRotate: rename
  # vs 'syslog' which sends log info to a syslog server
  destination: file
  # if we use 'destination: file' we need to specify this file's path 
  path: /var/log/mongodb/mongod.log 

net:
  port: 27017
  # only allow localhost to connect to mongod
  bindIp: 127.0.0.1 
  # validation to prevent insertion of invalid/corrupt data
  wireObjectCheck: true 
  http:
    # definitely don't enable anything related to http
    enabled: false
  ssl:
    mode: disabled

security:
  # turn off the default mode where everyone can do everything (need admin user first)
  authorization: enabled
  # need JS to run $where, mapreduce, and group commands otherwise it's safer to leave it off
  javascriptEnabled: false


storage:
  # where should we store our data?
  dbPath: /var/lib/mongodb
  # protects data if mongod crashes mid-operation
  journal:
    enabled: true
    # autosave every 100 ms
    commitIntervalMs: 100
```

Let's restart our server and make sure all the changes we made didn't break anything

```bash
sudo kill `ps -e | grep mongod | egrep "[0-9]+" -o | head -n 1`
sudo mongod -f /etc/mongod.conf &
// no errors? We're good!
```

## Start mongo automatically on startup

```bash
# create a mongodb user if one doesn't already exist (it probably does)
sudo adduser --disabled-password --gecos "" mongodb

# Make this user the owner of everything mongo related
sudo chown mongodb:mongodb /etc/mongod.conf
sudo chown mongodb:mongodb -R /var/lib/mongodb
sudo chown mongodb:mongodb -R /var/log/mongodb

# S
sudo systemctl enable mongod
```

## Connecting to Mongo from Node script (w Monk)

If we want to read/write to our database from a node server, we'll need to provide our password. In case our server script ends up on github, let's not hard code our password. Instead, let's create a separate file to safely store our mongo user's password.

```bash
pwdFile=data/mongo-auth.secret

# Save our mongo password in a secret file
printf "Passw0rd" > $pwdFiles

# Lock down permissions on this file so only we can read it
chmod 600 $pwdFile

# Make sure git doesn't include it
printf "\n# Mongo password file\n$pwdFile\n" >> .gitignore

# Also, we'll want to install monk if it isn't installed already
# Hopefully you've installed node/npm already
npm install --save monk
```

Now, we can commit the following script to github without leaking our password!

```javascript
var fs = require('fs');

// load the mongo password from our secret file
var mongoauth = fs.readFileSync('data/mongo-auth.secret', {encoding: 'utf8'});

// url format: 'mongodb://username:password@host:port/database'
var url = 'mongodb://bohendo:' + mongoauth + '@127.0.0.1:27017/bohendo';

var db = require('monk')(url, function (err) { if (err) console.error(err); });

var bodycomp = db.get('bodycomp');

bodycomp.find()
    .then(function (data) {
        console.log("got data:", data);
        db.close();
    })
    .catch(function (err) {
        console.log("oh no: ", err);
        db.close();
    });

```

