
const merge = require('webpack-merge');
const webpack = require('webpack');

module.exports = merge(require('./webpack.common.js'), {

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
      // style-loader injects css into <style> tags
      // (needed for hot module replacement to work w stylesheets)
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('precss'), require('autoprefixer'),
              ],
            },
          },
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],

});
