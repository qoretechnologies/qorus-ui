import * as p from 'babel/polyfill';

import React from 'react';
import createHistory from 'history/lib/createBrowserHistory';
import settings from './js/settings';
import App from './js/app';

//const history = process.env.NODE_ENV === 'production' ? HashHistory : BrowserHistory

React.render(<App history={createHistory()} />, document.getElementById('app'));
