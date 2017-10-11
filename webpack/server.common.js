
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const node_modules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    node_modules[mod] = 'commonjs ' + mod
  })

module.exports = {

  entry: { server: './server.js', },

  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].bundle.js',
  },

  devtool: 'cheap-eval-source-map',
  target: 'node',
  externals: node_modules,

  plugins: [
    new webpack.IgnorePlugin(/\.s?css)$/),
  ],

};

