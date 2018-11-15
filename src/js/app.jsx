import React from 'react';
import { Provider } from 'react-redux';
import reduxStore from './store';
import { browserHistory } from 'react-router';
import Routes from './routes';
import pure from 'recompose/pure';

require('normalize.css/normalize.css');
require('@blueprintjs/core/dist/blueprint.css');
require('../fonts/Roboto.ttf');
require('@blueprintjs/core/resources/icons/icons-16.eot');
require('@blueprintjs/core/resources/icons/icons-16.ttf');
require('@blueprintjs/core/resources/icons/icons-16.woff');
require('@blueprintjs/core/resources/icons/icons-20.eot');
require('@blueprintjs/core/resources/icons/icons-20.ttf');
require('@blueprintjs/core/resources/icons/icons-20.woff');
require('bootstrap-loader');
require('font-awesome-webpack!../font-awesome.config.js');
require('../css/app.scss');

const App: Function = () => (
  <Provider store={reduxStore}>
    <div className="app__wrap">
      <Routes routerProps={{ history: browserHistory }} />
    </div>
  </Provider>
);

export default pure(App);
