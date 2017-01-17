/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Transition from 'react-addons-css-transition-group';

import { CenterWrapper } from '../../components/layout';
import actions from '../../store/api/actions';
import LoginForm from '../../containers/auth/form';
import SystemInfo from '../../containers/system_info';
import { auth } from '../../helpers/user';
import logo from '../../../img/qore_logo.png';

class Login extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  props: {
    location: any,
    sendAuthCredentials: () => Promise<*>,
  };

  handleSubmit = async (
    { login, password }: { login: string, password: string }
  ): Promise<*> => {
    await auth(login, password, this.props.sendAuthCredentials);

    const { router } = this.context;
    const { location } = this.props;

    const nextUrl = location.query.next || '/';
    router.push(nextUrl);
  };

  render() {
    return (
      <div className="full-background">
        <CenterWrapper>
          <Transition
            transitionName="bubble"
            transitionAppear
            transitionAppearTimeout={500000}
            transitionEnter={false}
            transitionLeave={false}
            component="div"
          >
            <div className="login-wrapper">
              <h1 className="login-header">
                <img src={logo} />
                Qorus Integration Engine
                <p className="login-instance-wrapper">
                  <span> qorus-test-instance </span>
                </p>
              </h1>
              <LoginForm onSubmit={this.handleSubmit} />
            </div>
          </Transition>
        </CenterWrapper>
        <SystemInfo />
      </div>
    );
  }
}

Login.propTypes = {
  location: PropTypes.object,
  sendAuthCredentials: PropTypes.func.isRequired,
};

export default connect(
  () => ({}),
  actions.auth
)(Login);
