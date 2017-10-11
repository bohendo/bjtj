
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    client: './client.js',
  },

  output: {
    path: path.join(__dirname, './dist/client'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.woff2?$|\.ttf$|\.eot$|\.svg$/,
        loader: 'file-loader',
      },
    ],
  },

  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],

};

