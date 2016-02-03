import 'babel-polyfill';
import './ie10-fix';


import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';


require('./index.html');

ReactDOM.render(
  <App env={process.env} />,
  document.body.firstElementChild
);
