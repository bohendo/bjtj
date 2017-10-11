
const merge = require('webpack-merge')
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

module.exports = merge(require('./server.common.js'), {

  // https://webpack.js.org/configuration/devtool/
  devtool: 'cheap-eval-source-map',

  devServer: {
    // folder to serve files out of
    contentBase: 'dist',
    hot: true,
    port: 3000,
  },

  // location of files according to our browser
  output: { publicPath: '/' },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['react-hot-loader/webpack', 'babel-loader'],
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

});
