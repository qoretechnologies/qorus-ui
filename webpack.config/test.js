'use strict';


const webpack = require('webpack');

const compiler = require('./compiler');


module.exports = function testConfig() {
  const config = compiler.config();

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': compiler.env(),
    }),
    new webpack.NoErrorsPlugin()
  );

  config.debug = true;

  return config;
};
