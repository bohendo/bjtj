
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

  target: 'node',

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
    // but I don't want any c++, force the js version to be loaded instead.
    alias: { 'scrypt.js': 'scryptsy' },
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.IgnorePlugin(
      /\.s?css$/
    ),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
    }),
  ],

}

