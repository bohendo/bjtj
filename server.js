
//////////////////////////////
// Load dependencies

const path = require('path');
const fs = require('fs');
const app = require('express')();

//////////////////////////////
// Setup dev environment

const webpack = require('webpack');
const config = require('./webpack.dev.js');

const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
}));

app.use(require("webpack-hot-middleware")(compiler));

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

const staticDir = path.join(__dirname, '/static/');

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(`${staticDir}index.html`));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// error handler goes at the end of our pipe
app.use((req, res) => {
  res.sendFile(path.join(staticDir, 'error.html'));
});

//////////////////////////////
// start http server

app.listen(3000);

