const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, './demo'),
  entry: {
    app: ['./index.js','../src/App.js'],
  },
  output: {
    path: path.resolve(__dirname, './demo/public'),
    filename: 'demo.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react']
          }
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react']
          }
        },
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader'},
          // { loader: MiniCssExtractPlugin.loader},
          {
            loader: 'css-loader', options: {
              sourceMap: true
            }},
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js','.jsx'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '../css/[name].css',
      chunkFilename: '[id].css',
    })
  ],
};
