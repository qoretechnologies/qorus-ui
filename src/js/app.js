import React, { Component, PropTypes } from 'react';
import { Route, Router } from 'react-router';
import { Provider } from 'react-redux';
import Workflows from './views/workflows';
import store from './store';
import Root from './views/app';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

require('bootstrap-sass!../bootstrap-sass.config.js');
require('style!../css/base.css');
require('style!../css/line.numbers.css');
require('font-awesome-webpack!../font-awesome.config.js');
require("expose?React!react");


class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { history } = this.props;

    return (
      <div>
        <Provider store={store}>
          {() =>
            <Router history={ history }>
              <Route path='/' component={Root}>
                <Route path='dashboard' />
                <Route path='system' />
                <Route
                  path='workflows(/:date)(/:filter)(/:detailId)(/:tabId)'
                  component={Workflows} />
                <Route path='services'/>
                <Route path='jobs'/>
                <Route path='search'/>
                <Route path='groups'/>
                <Route path='ocmd'/>
                <Route path='library'/>
                <Route path='extensions'/>
                <Route path='performance'/>
              </Route>
            </Router>
          }
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
        </DebugPanel>
      </div>
    );
  }
}

export default App;
