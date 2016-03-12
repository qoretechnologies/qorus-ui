'use strict';


let config;
try {
  config = require(`./webpack.config/${process.env.NODE_ENV || 'development'}`);
} catch (e) {
  config = require('./webpack.config/compiler').config;
}

module.exports = config();
