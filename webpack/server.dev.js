
const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

module.exports = merge(require('./server.prod.js'), {

  // https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-eval-source-map',

  // location of files according to our browser
  output: { publicPath: '/' },

  recordsPath: path.join(__dirname, '../built/records'),

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('development') },
    }),
  ],

});
