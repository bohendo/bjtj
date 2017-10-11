
const merge = require('webpack-merge')
const webpack = require('webpack')

module.exports = merge(require('./server.common.js'), {

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

});
