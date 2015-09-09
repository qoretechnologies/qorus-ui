import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Navigation from '../components/navigation';
import Header from '../components/header';
import restApi from '../lib/qorus-api';

const restActions = restApi.actions;

class Footer extends Component {
  render () {
    const { info } = this.props;

    return (
      <footer id="footer" className="footer">
        <div className="container-fluid">
          <p className="credit muted pull-right">Qorus Integration Engine <small>(Schema: <span id="schema">Unknown</span>)</small>
            <small>(Version: <span id="build">{ info.version }</span>)</small> &copy; <a href="http://qoretechnologies.com">Qore Technologies</a> |
            <a href="http://bugs.qoretechnologies.com/projects/webapp-interface/issues/new">Report Bug</a></p>
        </div>
      </footer>
    );
  }
}

class Notifications extends Component {
  render () {
    return (
      <div id="notifications-list" />
    );
  }
}


class Messenger extends Component {
  render () {
    return (
      <ul id="msg" className="messenger messenger-fixed messenger-on-bottom messenger-on-right messenger-theme-block" />
    );
  }
}

class Content extends Component {
  render () {
    const { content } = this.props;

    return (
      <section className="section container-fluid">
        <div className="row">
          <section className="col-md-12 page">
            <article id="content">
              { content }
            </article>
            <div className="push"></div>
          </section>
        </div>
        <div className="push"></div>
      </section>
    );
  }
}

class Root extends Component {
  constructor(...props) {
    super(...props);

  }

  componentWillMount () {
    const { dispatch } = this.props;
    dispatch(restActions.systemInfo.sync());
  }

  render () {
    var { menu, info } = this.props;

    menu = menu || {};
    info = info.data || {};

    return (
      <div className="navigation-pinned">
        <Navigation mainItems={ menu.mainItems } extraItems={[]} />
        <div id="wrap">
          <Header info={ info } />
          <Content content={ this.props.children } />
        </div>
        <Messenger />
        <Footer info={ info } />
        <Notifications />
      </div>
    )
  }
}

function systemInfo(state) {
  console.log(state);

  return {
    info: state.systemInfo,
    menu: state.menu
  }
}

export default connect(systemInfo)(Root);
