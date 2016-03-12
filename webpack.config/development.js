'use strict';


const webpack = require('webpack');

const compiler = require('./compiler');
const dev = require('./dev');


module.exports = function developmentConfig() {
  const config = compiler.config();

  config.module.loaders[0].loaders.unshift('react-hot');

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': compiler.env({ DEVTOOLS: true }),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  config.debug = true;
  config.devtool = 'source-map';

  config.devServer = dev();

  return config;
};
