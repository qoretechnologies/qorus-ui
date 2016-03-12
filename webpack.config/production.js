'use strict';


const webpack = require('webpack');

const compiler = require('./compiler');


module.exports = function productionConfig() {
  const config = compiler.config();

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': compiler.env(),
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
