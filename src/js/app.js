import React, { Component, PropTypes } from 'react';
import { Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import Workflows from './views/workflows';
import store from './store';
import Root from './views/app';

require("bootstrap-sass!../bootstrap-sass.config.js");
require("style!../css/base.css");
require("style!../css/line.numbers.css");
require("style!../css/font-awesome/css/font-awesome.min.css");


class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { history } = this.props;

    return (
      <Provider store={store}>
        {() =>
          <Router history={history}>
            <Route path='/' component={Root}>
              <Route path='dashboard' />
              <Route path='system'/>
              <Route path='workflows(/:date)(/:filter)(/:detailId)(/:tabId)' component={Workflows}/>
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
    );
  }
}

export default App;
