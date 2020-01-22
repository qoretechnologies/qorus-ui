import React from 'react';
import { Provider } from 'react-redux';
import reduxStore from './store';
import { browserHistory } from 'react-router';
import Routes from './routes';
import { hot } from 'react-hot-loader/root';

require('normalize.css/normalize.css');
require('@blueprintjs/core/lib/css/blueprint.css');
require('../fonts/Roboto.ttf');
require('../fonts/Roboto-Regular.ttf');
require('../fonts/NeoLight.ttf');
require('../favicon.ico');
require('bootstrap-sass/assets/stylesheets/_bootstrap.scss');
require('../css/app.scss');

const App: Function = () => (
  <Provider store={reduxStore}>
    <div className="app__wrap">
      <Routes routerProps={{ history: browserHistory }} />
    </div>
  </Provider>
);

export default hot(App);
