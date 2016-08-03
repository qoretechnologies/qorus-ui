import 'babel-polyfill';
import './ie10-fix';


import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';
import isSupported from './js/helpers/is_supported';


require('./index.html');

if (isSupported(window.navigator.userAgent)) {
  ReactDOM.render(
    <App env={process.env} />,
    document.body.firstElementChild
  );
} else {
  const notSupported = document.getElementById('not-supported');
  notSupported.style.display = 'block';
}
