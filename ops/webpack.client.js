
const path = require('path');
const webpack = require('webpack');

module.exports = {

  mode: 'development',

  entry: './client/entry.js',

  output: {
    path: path.join(__dirname, '../build'),
    filename: 'client.bundle.js',
  },

  resolve: {
    extensions: ['.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['es2015','react'],
            },
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.txt$/,
        use: [{ loader: 'raw-loader' }]
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') },
    }),
  ],
};
