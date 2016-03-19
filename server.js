'use strict';


const express = require('express');
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');


const config = require('./webpack.config');

const serverConfig = require('./webpack.config/dev')();
const url = `http://${serverConfig.host}:${serverConfig.port}`;

const app = express();

switch (app.get('env')) {
  case 'production':
    app.use(history());
    app.get('*', serveStatic(config.output.path));
    break;

  default:
    app.use('/api', require('./api'));
    app.use(history());
    app.use(require('webpack-dev-middleware')(
      require('webpack')(config),
      config.devServer
    ));
    app.get('*', serveStatic(config.context));
    break;
}

app.listen(
  serverConfig.port,
  serverConfig.host,
  () => {
    if (app.get('env') !== 'test') {
      process.stdout.write(
        `Qorus Webapp ${app.get('env')} server listening on ${url}\n`
      );
    }

    if (process.send) process.send(url);
  }
);
