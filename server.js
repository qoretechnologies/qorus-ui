'use strict';


const express = require('express');
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');

const config = require('./webpack.config');
const devConfig = require('./webpack.config/dev');


const app = express();

switch (app.get('env')) {
  case 'production':
    app.use(history());
    app.get('*', serveStatic(config.output.path));
    break;

  default: {
    const webpack = require('webpack');
    const compiler = webpack(config);

    let api;
    const reload = () => { api = require('./api')(); };
    process.on('SIGUSR2', reload);
    reload();

    app.use((req, res, next) => api(req, res, next));
    app.use(history());
    app.use(require('webpack-dev-middleware')(compiler, config.devServer));
    if (config.plugins && config.plugins.some(p => (
      p instanceof webpack.HotModuleReplacementPlugin
    ))) {
      app.use(require('webpack-hot-middleware')(compiler));
    }
    app.get('*', serveStatic(config.context));
    break;
  }
}

const serverConfig = devConfig();
app.listen(
  serverConfig.port,
  serverConfig.host,
  function onListening() {
    if (process.env.PIDFILE) {
      const pidfile = require('path').resolve(__dirname, process.env.PIDFILE);

      try {
        require('fs').statSync(pidfile);
        process.stdout.write(
          `PIDFILE "${process.env.PIDFILE}" already exists\n`
        );
        this.close();
        process.exit(1);
      } catch (e) {
        // Do nothing.
      }

      require('fs').writeFileSync(pidfile, `${process.pid}`, 'ascii');
      process.on('SIGINT', () => {
        require('fs').unlinkSync(pidfile);
        this.close();
        process.exit();
      });
    }

    if (app.get('env') !== 'test1') {
      process.stdout.write(
        `Qorus Webapp ${app.get('env')} server listening on ` +
        `http://${serverConfig.host}:${serverConfig.port}\n`
      );
    }
  }
);
