import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';


import Navigation from 'components/navigation';
import Header from 'components/header';
import Footer from 'components/footer';
import Notifications from 'components/notifications';
import Messenger from 'components/messenger';
import { Manager as ModalManager } from 'components/modal';


import apiActions from 'store/api/actions';


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
export default class Root extends Component {
  static propTypes = {
    children: PropTypes.node,
    menu: PropTypes.object,
    info: PropTypes.object,
    dispatch: PropTypes.func,
    route: PropTypes.object,
    currentUser: PropTypes.object
  };

  static childContextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { dispatch } = this.props;

    this._modal = null;

    dispatch(apiActions.system.fetch());
    dispatch(apiActions.systemOptions.fetch());
    dispatch(apiActions.currentUser.fetch());
    dispatch(apiActions.errors.fetch('global'));
  }

  getChildContext() {
    return {
      openModal: (...args) => this._modal.open(...args),
      closeModal: (...args) => this._modal.close(...args)
    };
  }

  componentWillMount() {
    this.setTitle();
  }

  setTitle() {
    if (!this.props.info.synced) return;

    document.title =
      `${this.props.info.data['instance-key']} | ` +
      `${this.props.info.data['omq-version']}`;
  }

  render() {
    return (
      <div className='navigation-pinned'>
        <Navigation
          mainItems={this.props.menu.mainItems}
          extraItems={[]}
        />
        <div id='wrap'>
          <Header
            info={this.props.info.data}
            currentUser={this.props.currentUser.data}
          />
          <section className='section container-fluid'>
            <div className='row'>
              <section className='col-md-12 page'>
                <article id='content'>
                  {this.props.children}
                </article>
                <div className='push'></div>
              </section>
            </div>
            <div className='push'></div>
          </section>
        </div>
        <Messenger />
        <Footer info={this.props.info} />
        <Notifications />
        <ModalManager ref={c => this._modal = c} />
      </div>
    );
  }
}
