'use strict';


const webpack = require('webpack');

const compilerConfig = require('./compiler');
const devConfig = require('./dev');


/**
 * Returns a webpack config for test environment.
 *
 * It is a mix between development and production setup. It does not
 * pass actual `NODE_ENV` to the code but overrides it with
 * 'production'.  However, it sets `TESTINST` environment variable to
 * `true` to setup test instrumentation in the webapp. It does not
 * optimize the code, but runs React in production setup. It also
 * supports the webpack dev server, but does not output anything
 * expect for errors. Similarly, it is expected that the webapp does
 * not print any debug messages to console to keep test result clean.
 */
module.exports = function testConfig() {
  const config = compilerConfig();

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: 'production',
        TESTINST: true,
      }),
    }),
    new webpack.NoErrorsPlugin()
  );

  config.devServer = devConfig();

  return config;
};
