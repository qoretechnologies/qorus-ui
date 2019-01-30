import '@babel/polyfill';
import './ie10-fix';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/app';

require('./html/index.html');

global.env = process.env;

ReactDOM.render(<App env={process.env} />, document.body.firstElementChild);
