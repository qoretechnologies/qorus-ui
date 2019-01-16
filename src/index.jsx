import '@babel/polyfill';
import './ie10-fix';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';
import isSupported from './js/helpers/is_supported';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

if (process.env.NODE_ENV === 'development') {
  require('./html/dev/index.html');
} else {
  require('./html/index.html');
}

global.env = process.env;

if (isSupported(window.navigator.userAgent)) {
  ReactDOM.render(
    <MuiThemeProvider>
      <App env={process.env} />
    </MuiThemeProvider>,
    document.body.firstElementChild
  );
} else {
  const notSupported = document.getElementById('not-supported');
  notSupported.style.display = 'block';
}
