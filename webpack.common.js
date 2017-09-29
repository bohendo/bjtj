
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    blog: './c/entry.js',
  },

  output: {
    path: path.join(__dirname, 'static'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        loader: "file-loader"
      },
    ]
  },

  plugins: [
    new HtmlPlugin({
      template: './c/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
  ],

};

