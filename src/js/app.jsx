import React, { Component, PropTypes } from 'react';
import { Route, Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';


import Root from 'views/root';
import Workflows from 'views/workflows';


import setupStore from 'store';


require('bootstrap-loader');
require('font-awesome-webpack!../font-awesome.config.js');
require('../css/app.scss');


/**
 * Main application component.
 *
 * It combines Redux store provider, React Router and Redux DevTools
 * if enabled.
 *
 * If DevTools are enabled, they are loaded and initialized
 * asynchronously from different webpack chunk named `devtools`.
 */
export default class App extends Component {
  static propTypes = {
    env: PropTypes.shape({
      NODE_ENV: PropTypes.string.isRequired,
      DEVTOOLS: PropTypes.bool,
    }).isRequired,
  };


  componentWillMount() {
    this.loadStore();
    this.loadDevTools();
  }


  loadStore() {
    this.setState({ store: null });
    setupStore(this.props.env.NODE_ENV).then(store => this.setState({ store }));
  }


  loadDevTools() {
    switch (this.props.env.NODE_ENV) {
      case 'production':
        this.setState({ devToolsReady: false });
        break;
      default:
        this.setState({ devToolsReady: false });
        require.ensure([
          'components/dev_tools',
          'react-addons-perf',
        ], require => {
          const DevTools = require('components/dev_tools').default;
          require('expose?Perf!react-addons-perf');

          this.setState({
            devToolsReady: true,
            DevTools,
          });
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
    if (!this.props.env.DEVTOOLS || !this.state.devToolsReady ||
        !this.state.DevTools) return null;

    const { DevTools } = this.state;

    return (
      <DevTools />
    );
  }


  render() {
    if (!this.state.store) return this.renderEmpty();

    return (
      <Provider store={this.state.store}>
        <div className="app__wrap">
          <Router history={browserHistory}>
            <Route path="/" component={Root}>
              <Route path="dashboard" />
              <Route path="system" />
              <Route
                path="workflows(/:date)(/:filter)(/:detailId)(/:tabId)"
                component={Workflows}
              />
              <Route path="services"/>
              <Route path="jobs"/>
              <Route path="search"/>
              <Route path="groups(/:name)"/>
              <Route path="ocmd"/>
              <Route path="library"/>
              <Route path="extensions"/>
              <Route path="performance"/>
            </Route>
          </Router>
          {this.renderDevTools()}
        </div>
      </Provider>
    );
  }
}
