import React, { Component, PropTypes } from 'react'
import { Router, Route } from 'react-router'
import { Provider } from 'react-redux'
import { store } from './redux'
import Root from './views/app'

require("bootstrap-sass!../bootstrap-sass.config.js")
require("style!../css/base.css")
require("style!../css/line.numbers.css")
require("style!../css/font-awesome/css/font-awesome.min.css")

class Dashboard extends Component {
  render () {
    return (
      <div>
        <h1>Welcome</h1>
      </div>
    )
  }
}

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
                  <Route path='dashboard' componet={Dashboard} />
                </Route>
              </Router>
          }
        </Provider>
    );
  }
}

export default App;
