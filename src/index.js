import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';
import history from './js/history';


require('./index.html');

ReactDOM.render(
  <App history={history} env={APP_ENV} />,
  document.getElementById('app')
);
