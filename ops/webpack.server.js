
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

  target: 'node',

  // some stupid web3 dependency requires electron but doesn't 
  // mention it in their package.json, this fixes 'module not found' error
  externals: 'electron',

  entry: {
    server: './src/server.js',
  },

  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].bundle.js',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],

    // scrypt.js says "if target is node, use c++ implementation, otherwise use js"
    // but I don't want any c++, let's force the js version to always be loaded.
    alias: { 'scrypt.js': 'scryptsy' },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    // The server has nothing to do with stylesheets.
    // During server-side renders, nginx provides style.css
    new webpack.IgnorePlugin(/\.s?css$/),
  ],

}

