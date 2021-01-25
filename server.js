// @flow
const express = require('express');
const https = require('https');
const fs = require('fs');
const history = require('connect-history-api-fallback');
const serveStatic = require('serve-static');
const config = require('./webpack.config');

const app = express();
const env = app.get('env');

if (env === 'production') {
  app.use(history());
  app.get('*', serveStatic(config.output.path));
} else {
  // Get webpack
  const {
    API_URL,
    API_WS_URL,
    SERVER_URL,
    IS_SECURE,
    LOCAL_HOST,
    LOCAL_PORT,
  } = require('./server_config.js');
  const webpack = require('webpack');
  const proxyMiddleware = require('http-proxy-middleware');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(config);

  // History
  app.use(history());

  // Proxy
  app.use(proxyMiddleware('/api', { target: API_URL, secure: false }));
  app.use(proxyMiddleware('/raw', { target: API_URL, secure: false }));
  app.use(proxyMiddleware('/oauth2/v1', { target: API_URL, secure: false }));
  app.use(
    proxyMiddleware('/apievents', {
      target: `${API_WS_URL}/apievents`,
      secure: false,
      ws: true,
    })
  );
  app.use(
    proxyMiddleware('/log/', {
      target: `${API_WS_URL}`,
      secure: false,
      ws: true,
    })
  );
  app.use(
    proxyMiddleware('/remote-command', {
      target: `${API_WS_URL}`,
      secure: false,
      ws: true,
    })
  );

  // Dev server
  const devMiddleware = webpackDevMiddleware(compiler, {
    inline: true,
    host: 'localhost',
    port: parseInt(process.env.PORT, 10),
    historyApiFallback: true,
    publicPath: config.output.publicPath,
    noInfo: true,
    stats: { colors: true },
    hot: true,
  });

  devMiddleware.invalidate();

  app.use(devMiddleware);

  // Hot reloading
  app.use(webpackHotMiddleware(compiler, { noInfo: false }));

  // Is HTTPS?
  if (IS_SECURE) {
    https
      .createServer(
        {
          key: fs.readFileSync('./server.key'),
          cert: fs.readFileSync('./server.cert'),
        },
        app
      )
      .listen(LOCAL_PORT, LOCAL_HOST, () => {
        process.stdout.write(
          `Qorus Webapp ${app.get('env')} server listening on ` +
            `${SERVER_URL}\n`
        );
      });
  } else {
    app.listen(LOCAL_PORT, LOCAL_HOST, () => {
      process.stdout.write(
        `Qorus Webapp ${app.get('env')} server listening on ` +
          `${SERVER_URL}\n`
      );
    });
  }
}
