import * as p from 'babel/polyfill'

import React from 'react'
import BrowserHistory from 'react-router/lib/BrowserHistory'
import HashHistory from 'react-router/lib/HashHistory'
import App from './js/app'

const history = process.env.NODE_ENV === 'production' ? HashHistory : BrowserHistory

React.render(<App history={history} />, document.getElementById('app'))
