
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

