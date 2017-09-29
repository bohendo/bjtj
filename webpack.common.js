
const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    bjvm: './src/entry.js',
  },

  output: {
    path: path.join(__dirname, 'dist'),
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
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
  ],

};

