'use strict';


const compiler = require('./compiler');


module.exports = function serverConfig() {
  const config = compiler.config();

  return {
    contentBase: config.context,
    inline: true,
    hot: process.env.NODE_ENV !== 'test',
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000,
    historyApiFallback: true,
    noInfo: process.env.NODE_ENV === 'test',
    publicPath: config.output.publicPath,
    stats: { colors: true },
  };
};
