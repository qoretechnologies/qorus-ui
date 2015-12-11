import React, { Component, PropTypes } from 'react';
import { Route, Router } from 'react-router';
import { Provider } from 'react-redux';


import Root from 'views/root';
import Workflows from 'views/workflows';


import setupStore from 'store';


require('bootstrap-sass!../bootstrap-sass.config.js');
require('font-awesome-webpack!../font-awesome.config.js');
require('../css/base.css');
require('../css/line.numbers.css');
require('../css/app.scss');


class App extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    env: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {};

    this.loadStore();
    this.loadDevTools();
  }

  loadStore() {
    this.state.store = null;

    setupStore(this.props.env.NODE_ENV).then((store) => {
      this.setState(Object.assign({}, this.state, { store }));
    });
  }

  loadDevTools() {
    switch (this.props.env.NODE_ENV) {
      case 'production':
        this.state.devToolsReady = true;
        break;
      default:
        this.state.devToolsReady = false;
        require.ensure([
          'redux-devtools/lib/react', 'react-addons-perf'
        ], (require) => {
          const { DevTools, DebugPanel, LogMonitor } =
            require('redux-devtools/lib/react');
          const Perf =
            require('react-addons-perf');
          window.Perf = Perf;

          this.setState(Object.assign({}, this.state, {
            devToolsReady: true,
            DevTools,
            DebugPanel,
            LogMonitor,
            Perf
          }));
        }, 'devtools');
        break;
    }
  }

  renderEmpty() {
    return (
      <div />
    );
  }

  renderDevTools() {
    if (!this.state.store || !this.state.devToolsReady ||
        !this.state.DebugPanel) return null;

    const { DebugPanel, DevTools, LogMonitor, store } = this.state;

    return (
      <DebugPanel top right bottom>
        <DevTools
          store={store}
          monitor={LogMonitor}
          visibleOnLoad={this.props.env.DEVTOOLS}
        />
      </DebugPanel>
    );
  }

  render() {
    if (!this.state.store) return this.renderEmpty();

    const { history } = this.props;

    return (
      <div>
        <Provider store={this.state.store}>
          <Router history={history}>
            <Route path='/' component={Root}>
              <Route path='dashboard' />
              <Route path='system' />
              <Route
                path='workflows(/:date)(/:filter)(/:detailId)(/:tabId)'
                component={Workflows} />
              <Route path='services'/>
              <Route path='jobs'/>
              <Route path='search'/>
              <Route path='groups(/:name)'/>
              <Route path='ocmd'/>
              <Route path='library'/>
              <Route path='extensions'/>
              <Route path='performance'/>
            </Route>
          </Router>
        </Provider>
        { this.renderDevTools() }
      </div>
    );
  }

}

export default App;
