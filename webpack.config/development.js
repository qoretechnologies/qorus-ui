'use strict';


const webpack = require('webpack');

const compilerConfig = require('./compiler');
const devConfig = require('./dev');


/**
 * Returns a webpack config for development environment.
 *
 * It has hot reload and debug information (including source maps).
 */
module.exports = function developmentConfig() {
  const config = compilerConfig();

  config.entry.qorus.push('webpack-hot-middleware/client');

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: 'development',
        DEVTOOLS: true,
      }),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  config.debug = true;
  config.devtool = 'eval-source-map';

  config.devServer = devConfig();

  return config;
};
