require('babel/polyfill');

import React from 'react';
import createHistory from 'history/lib/createBrowserHistory';
import App from './js/app';

React.render(<App history={createHistory()} />, document.getElementById('app'));
