/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { CenterWrapper } from '../../components/layout';
import actions from '../../store/api/actions';
import LoginForm from './form';
import SystemInfo from '../system-info';

import { auth } from '../../helpers/user';

class Login extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  props: {
    location: any,
    sendAuthCredentials: () => Promise<*>,
  };

  onSubmitSuccess = async () => {
    const { router } = this.context;
    const { location } = this.props;

    const nextUrl = location.query.next || '/';
    router.push(nextUrl);
  };

  handleSubmit = (
    { login, password }: { login: string, password: string }
  ): Promise<*> => (
    auth(login, password, this.props.sendAuthCredentials).then(this.onSubmitSuccess)
  );

  render() {
    return (
      <CenterWrapper>
        <h1>Qorus web application</h1>
        <LoginForm onSubmit={this.handleSubmit} />
        <SystemInfo />
      </CenterWrapper>
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
