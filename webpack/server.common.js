
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = {

  entry: {
    server: './src/server.js',
  },

  output: {
    path: path.join(__dirname, '../built'),
    filename: '[name].bundle.js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  target: 'node',

  externals: nodeModules,

  node: {
    __dirname: true,
    console: true,
  },

  plugins: [
    new webpack.IgnorePlugin(/\.s?css$/),
  ],

}

