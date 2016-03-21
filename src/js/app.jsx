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
      TESTINST: PropTypes.bool,
    }).isRequired,
  };


  /**
   * Initializes component.
   *
   * It requested, it sets up test instrumentation.
   *
   * @param {{ env: {
   *   NODE_ENV: string,
   *   DEVTOOLS: ?boolean,
   *   TESTINST: ?boolean,
   * }}} props
   * @see setupTestIntrumentation
   */
  constructor(props) {
    super(props);

    this.setupTestIntrumentation();
  }


  /**
   * Initializes store and DevTools.
   *
   * @see setupStore
   * @see setupDevTools
   */
  componentWillMount() {
    this.setupStore();
    this.setupDevTools();
  }


  /**
   * Returns props for the router element.
   *
   * It sets history to browser history (i.e., HTML History API).
   *
   * In test environment as part of test instrumentation, it sets
   * `onUpdate` to notify change with `WebappRouterUpdate` event.
   *
   * @return {{ history: Object, onUpdate: ?function }}
   * @see notifyChange
   */
  getRouterProps() {
    const props = {};
    props.history = browserHistory;

    if (this.props.env.TESTINST) {
      props.onUpdate = this.notifyChange.bind(this, 'WebappRouterUpdate');
    }

    return props;
  }


  /**
   * Mounts lifecycle methods in test to notify of DOM changes.
   *
   * Methods just notify change by dispatching `WebappDomUpdate`.
   * Because the notification is required after DOM changes, the
   * following lifecycle methods are aliased:
   *
   * - componentDidMount
   * - componentDidUpdate
   * - componentWillUnmount
   *
   * It is part of test instrumentation.
   *
   * @see notifyChange
   */
  setupTestIntrumentation() {
    if (!this.props.env.TESTINST) return;

    const didUpdate = this.notifyChange.bind(this, 'WebappDomUpdate');
    this.componentDidMount = didUpdate;
    this.componentDidUpdate = didUpdate;
    this.componentWillUnmount = didUpdate;
  }


  /**
   * Asynchronously loads store.
   *
   * Outside of 'production' environment it sets up store with
   * DevTools intrumentation, which is loaded from webpack chunk. That
   * is why the setup is asynchronous.
   */
  setupStore() {
    this.setState({ store: null });
    setupStore(this.props.env.NODE_ENV).then(store => this.setState({ store }));
  }


  /**
   * Asynchronously loads DevTools.
   *
   * DevTools are loaded from webpack chunk which is why the setup is
   * asynchronous.
   *
   */
  setupDevTools() {
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


  /**
   * Dispatches custom event on document.
   *
   * This should happen only in test environment and it is part of
   * test instrumentation.
   *
   * @param {string} type
   */
  notifyChange(type) {
    const ev = new Event(type);
    document.dispatchEvent(ev);
  }


  /**
   * Returns empty DIV element.
   *
   * @return {ReactElement}
   */
  renderEmpty() {
    return (
      <div />
    );
  }


  /**
   * Returns DevTools element if enabled and loaded.
   *
   * @return {ReactElement}
   */
  renderDevTools() {
    if (!this.props.env.DEVTOOLS || !this.state.devToolsReady ||
        !this.state.DevTools) return null;

    const { DevTools } = this.state;

    return (
      <DevTools />
    );
  }


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    if (!this.state.store) return this.renderEmpty();

    return (
      <Provider store={this.state.store}>
        <div className="app__wrap">
          <Router {...this.getRouterProps()}>
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
