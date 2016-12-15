import 'babel-polyfill';
import './ie10-fix';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';
import isSupported from './js/helpers/is_supported';

require('./index.html');
global.env = process.env;

// Uncomment when work on performance
/* if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React, { exclude: /^(Connect|Route|DockMonitor)/ });
} */

if (isSupported(window.navigator.userAgent)) {
  ReactDOM.render(
    <App env={process.env} />,
    document.body.firstElementChild
  );

  // Hot Module Replacement API
  if (module.hot && !process.env.TESTINST) {
    module.hot.decline('./js/routes.jsx');
    module.hot.accept('./js/app', () => {
      const NextApp = require('./js/app').default;
      ReactDOM.render(
        <NextApp env={process.env} />,
        document.body.firstElementChild
      );
    });
  }
} else {
  const notSupported = document.getElementById('not-supported');
  notSupported.style.display = 'block';
}
