require('babel/polyfill');

import React from 'react';
import App from './js/app';
import history from './js/history';

React.render(<App history={history} />, document.getElementById('app'));
