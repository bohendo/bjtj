
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

module.exports = {

  entry: {
    server: './src/server.js',
  },

  output: {
    path: path.join(__dirname, '../built'),
    filename: '[name].bundle.js',
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
        use: {loader: 'html-loader'},
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },

  target: 'node',

  devtool: 'cheap-eval-source-map',

  node: {
    __dirname: true,
    console: true,
  },

  plugins: [
    new webpack.IgnorePlugin(/\.s?css$/),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
    }),
  ],

}

