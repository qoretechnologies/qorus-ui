import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Navigation from '../components/navigation';
import Header from '../components/header';
import Footer from '../components/footer';
import Notifications from '../components/notifications';
import Messenger from '../components/messenger';
import restApi from '../qorus';

const restActions = restApi.actions;

class Content extends Component {
  static propTypes = {
    content: PropTypes.node
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

@connect((state) => {
  return {
    info: state.systemInfo,
    menu: state.menu
  };
})
class Root extends Component {
  static propTypes = {
    children: PropTypes.node,
    menu: PropTypes.array,
    info: PropTypes.object,
    dispatch: PropTypes.func
  }

  constructor(...props) {
    super(...props);

  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(restActions.systemInfo.sync());
    dispatch(restActions.currentUser.sync());
  }

  render() {
    let { menu, info } = this.props;

    menu = menu || {};
    info = info.data || {};

    return (
      <div className='navigation-pinned'>
        <Navigation mainItems={ menu.mainItems } extraItems={[]} />
        <div id='wrap'>
          <Header info={ info } />
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
