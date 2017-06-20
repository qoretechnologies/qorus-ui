import 'babel-polyfill';
import './ie10-fix';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';
import { getCookie } from './js/helpers/document';
import isSupported from './js/helpers/is_supported';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// Go to the old UI if the user has active cookie
if (getCookie('backbone')) {
  window.location.href = '/backbone/';
}

require('./index.html');
global.env = process.env;

// Uncomment when work on performance
/*
if (process.env.NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React, { exclude: /^(Connect|Route|DockMonitor)/ });
}
*/

if (isSupported(window.navigator.userAgent)) {
  ReactDOM.render(
    <MuiThemeProvider>
      <App env={process.env} />
    </MuiThemeProvider>,
    document.body.firstElementChild
  );

  // Hot Module Replacement API
  if (module.hot && !process.env.TESTINST) {
    module.hot.decline('./js/routes.jsx');
    module.hot.accept('./js/app', () => {
      const NextApp = require('./js/app').default;
      ReactDOM.render(
        <MuiThemeProvider>
          <NextApp env={process.env} />
        </MuiThemeProvider>,
        document.body.firstElementChild
      );
    });
  }
} else {
  const notSupported = document.getElementById('not-supported');
  notSupported.style.display = 'block';
}
