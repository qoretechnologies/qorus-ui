'use strict';


const webpack = require('webpack');

const compilerConfig = require('./compiler');


/**
 * Returns a webpack config for production build.
 */
module.exports = function productionConfig() {
  const config = compilerConfig();

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: 'production',
      }),
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  );

  return config;
};
