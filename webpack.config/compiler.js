'use strict';


const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const root = path.resolve(__dirname, '..');

module.exports.config = function config() {
  return {
    context: `${root}/src`,
    entry: {
      qorus: `${root}/src/index.jsx`,
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
          test: /\.jsx$/,
          exclude: /node_modules/,
          loaders: [
            'babel?' +
              'presets[]=es2015&presets[]=react&presets[]=stage-0&' +
              'plugins[]=transform-decorators-legacy',
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader:
          'babel?' +
            'presets[]=es2015&presets[]=stage-0&' +
            'plugins[]=transform-decorators-legacy',
        },
        {
          test: /\.html$/,
          loader: 'file?name=[name].[ext]',
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract(
            'style', 'css?sourceMap&minimize'
          ),
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract(
            'style',
            '' +
              'css?sourceMap!' +
              'sass?sourceMap&outputStyle=compressed'
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
          loaders: [
            'imports?this=>global',
            'exports?global.fetch',
          ],
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


module.exports.env = function env(opts) {
  const apiProto = process.env.API_PROTO || 'http';
  const apiHost = process.env.API_HOST || 'localhost';
  const apiPort = process.env.API_PORT || 8001;

  const isApiOverride =
    process.env.API_PROTO || process.env.API_HOST || process.env.API_PORT;
  const isRestOverride = isApiOverride || process.env.REST_API_BASE_URL;
  const isWsOverride = isApiOverride || process.env.WS_API_BASE_URL;

  const apiEnv = {};
  apiEnv.NODE_ENV = process.env.NODE_ENV || 'development';
  if (isRestOverride) {
    apiEnv.REST_API_BASE_URL = process.env.REST_API_PREFIX ||
      `${apiProto}://${apiHost}:${apiPort}/api`;
  }
  if (isWsOverride) {
    apiEnv.WS_API_BASE_URL = process.env.WS_API_BASE_URL ||
      `${apiProto === 'https' ? 'wss' : 'ws' }://${apiHost}:${apiPort}`;
  }

  return JSON.stringify(Object.assign({}, apiEnv, opts));
};
