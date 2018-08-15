'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const root = path.resolve(__dirname, '..');

module.exports = function compilerConfig() {
  return {
    context: `${root}/src`,
    entry: {
      qorus: [`${root}/src/index.jsx`],
    },
    output: {
      path: `${root}/dist`,
      filename: '[name].bundle.js',
      chunkFilename: '[name].bundle.js',
      publicPath: '/',
    },
    resolve: {
      root: `${root}/src/js`,
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [
        {
          test: /\.js(x)?$/,
          exclude: /node_modules/,
          loaders: [
            'babel?' +
              'presets[]=es2015&presets[]=react&presets[]=stage-0&' +
              'plugins[]=transform-decorators-legacy&plugins[]=transform-flow-strip-types',
          ],
        },
        {
          test: /\.html$/,
          loader: 'file?name=[name].[ext]',
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css?sourceMap&minimize'),
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract(
            'style',
            '' + 'css?sourceMap!' + 'sass?sourceMap&outputStyle=compressed'
          ),
        },
        {
          test: /\.png$/,
          loader: 'url?limit=100000',
        },
        {
          test: /\.jpg$/,
          loader: 'file',
        },
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file',
        },
        {
          test: require.resolve('whatwg-fetch'),
          loaders: ['imports?this=>global', 'exports?global.fetch'],
        },
      ],
    },
    plugins: [
      new ExtractTextPlugin('css/base.css'),
      new webpack.ProvidePlugin({
        fetch: 'whatwg-fetch',
        'window.fetch': 'whatwg-fetch',
      }),
    ],
  };
};
