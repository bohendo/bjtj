
const merge = require('webpack-merge');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyCssPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(require('./webpack.common.js'), {

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env': { 'NODE_ENV': JSON.stringify('production') }
    }),
    new UglifyCssPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } }
    }),
    new UglifyJSPlugin(),
  ],
});
