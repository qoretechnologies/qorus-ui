'use strict';

const compilerConfig = require('./compiler');

module.exports = function devConfig() {
  const config = compilerConfig();

  return {
    contentBase: config.context,
    inline: true,
    hot: false,
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000,
    historyApiFallback: true,
    noInfo: process.env.NODE_ENV === 'test',
    publicPath: config.output.publicPath,
    stats: { colors: true },
  };
};
