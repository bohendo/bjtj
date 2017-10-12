
const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

module.exports = merge(require('./server.common.js'), {

  // https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-eval-source-map',

  // location of files according to our browser
  output: { publicPath: '/' },

  recordsPath: path.join(__dirname, '../build/records'),

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

});
