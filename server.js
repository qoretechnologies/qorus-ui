'use strict';


const express = require('express');
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');


const config = require('./webpack.config');

const app = express();
app.use(history());

switch (app.get('env')) {
  case 'production':
    app.get('*', serveStatic(config.output.path));
    break;

  default:
    app.use(require('webpack-dev-middleware')(
      require('webpack')(config), config.devServer
    ));
    app.get('*', serveStatic(config.context));
    break;
}


app.listen(
  parseInt(process.env.PORT, 10) || 3000,
  process.env.SOCKET || process.env.HOST || 'localhost',
  () => {
    if (process.env.SOCKET) {
      process.stdout.write(
        `Qorus Webapp ${app.get('env')} server ` +
        `listening on ${process.env.SOCKET}` +
        '\n'
      );
    } else {
      process.stdout.write(
        `Qorus Webapp ${app.get('env')} server listening on http://` +
        `${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}` +
        '\n'
      );
    }
  }
);
