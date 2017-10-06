
//////////////////////////////
// Load dependencies

const path = require('path');
const fs = require('fs');
const express = require('express');

const app = express();


//////////////////////////////
// setup Mongo connection

/*
const db = require('monk')(
  // monk arg1: url w format: 'mongodb://user:password@host:port/database'
  `mongodb://bohendo:${fs.readFileSync('data/mongo-auth.secret', 'utf8')}@127.0.0.1:27017/bohendo`,
  // monk arg2: error callback
  (err) => { if (err) console.error(err); }
);
*/

//////////////////////////////
// Express pipeline

const distDir = path.join(__dirname, '/dist');

app.use(express.static(distDir));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(${distDir}, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// error handler goes at the end of our pipe
app.use((req, res) => {
  res.status(404).send('This page doesn\'t exist. Well THIS one does but whichever one you were looking for doesn\'t unless you were looking for this one in which case here it is');
});

//////////////////////////////
// start http server

app.listen(3000);

