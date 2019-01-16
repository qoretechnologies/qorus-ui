// @flow
const express = require('express');
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
  const APIconfig = require('./server_config.js');
  const webpack = require('webpack');
  const proxyMiddleware = require('http-proxy-middleware');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(config);

  app.use(proxyMiddleware('/api', { target: APIconfig.restBaseUrl }));
  app.use(
    proxyMiddleware('/apievents', {
      target: `${APIconfig.wsBaseUrl}/apievents`,
      ws: true,
    })
  );
  app.use(
    proxyMiddleware('/log', {
      target: `${APIconfig.wsBaseUrl}/log`,
      ws: true,
    })
  );

  // History
  app.use(history());

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
  app.use(webpackHotMiddleware(compiler, { noInfo: false }));

  // Serving
  app.get('*', serveStatic(config.output.path));

  // Dev config
  app.listen(process.env.PORT, 'localhost', () => {
    process.stdout.write(
      `Qorus Webapp ${app.get('env')} server listening on ` +
        `http://localhost:${process.env.PORT}\n`
    );
  });
}
