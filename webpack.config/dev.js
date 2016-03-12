'use strict';


const compiler = require('./compiler');


module.exports = function serverConfig() {
  const config = compiler.config();

  return {
    contentBase: config.context,
    inline: true,
    hot: true,
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000,
    historyApiFallback: true,
    publicPath: config.output.publicPath,
    stats: { colors: true },
  };
};
