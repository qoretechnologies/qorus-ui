import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Navigation from '../components/navigation';
import Header from '../components/header';
import Footer from '../components/footer';
import Notifications from '../components/notifications';
import Messenger from '../components/messenger';

import apiActions from '../store/api/actions';

const systemActions = apiActions.system;
const userActions = apiActions.currentUser;

class Content extends Component {
  static propTypes = {
    content: PropTypes.node,
    instanceKey: PropTypes.string
  }

  render() {
    const { content } = this.props;

    return (
      <section className='section container-fluid'>
        <div className='row'>
          <section className='col-md-12 page'>
            <article id='content'>
              { content }
            </article>
            <div className='push'></div>
          </section>
        </div>
        <div className='push'></div>
      </section>
    );
  }
}


const systemSelector = (state) => state.api.system;
const currentUserSelector = (state) => state.api.currentUser;
const menuSelector = (state) => state.menu;

@connect(createSelector(
  systemSelector,
  currentUserSelector,
  menuSelector,
  (info, currentUser, menu) => {
    return {
      info,
      currentUser,
      menu
    };
  }
), null, null, { pure: false })
class Root extends Component {
  static propTypes = {
    children: PropTypes.node,
    menu: PropTypes.object,
    info: PropTypes.object,
    dispatch: PropTypes.func,
    route: PropTypes.object,
    currentUser: PropTypes.object
  }

  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(systemActions.fetch());
    dispatch(userActions.fetch());
  }

  componentWillMount() {
    this.setTitle();
  }

  // componentDidUpdate() {
  //   this.setTitle();
  // }

  setTitle() {
    const { info } = this.props;

    if (info.synced) {
      const inst = `${info.data['instance-key']} | ${info.data['omq-version']}`;
      document.title = inst;
    }
  }

  render() {
    const { menu, info, currentUser } = this.props;

    return (
      <div className='navigation-pinned'>
        <Navigation mainItems={ menu.mainItems } extraItems={[]} />
        <div id='wrap'>
          <Header info={ info.data } currentUser={ currentUser.data }/>
          <Content content={ this.props.children } />
        </div>
        <Messenger />
        <Footer info={ info } />
        <Notifications />
      </div>
    );
  }
}

export default Root;
