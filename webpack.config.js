'use strict';


let config;
try {
  config = require(`./webpack.config/${process.env.NODE_ENV || 'development'}`);
} catch (e) {
  if (e.code === 'MODULE_NOT_FOUND') {
    process.stdout.write(
      `No webpack configuration for "${process.env.NODE_ENV}" environment ` +
      'found.\n'
    );
    process.exit(1);
  } else {
    throw e;
  }
}

module.exports = config();
