/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { CenterWrapper } from '../../components/layout';
import actions from '../../store/api/actions';
import LoginForm from './form';

class Login extends Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  props: {
    location: any,
    sendAuthCredentials: () => Promise<*>,
  }

  onSubmitSuccess = async () => {
    const { router } = this.context;
    const { location } = this.props;

    const nextUrl = location.query.next || '/';
    router.push(nextUrl);
  }

  handleSubmit = (
    { login, password }: { login: string, password: string }
  ): Promise<*> => {
    const { sendAuthCredentials } = this.props;
    return new Promise(async (resolve, reject) => {
      try {
        const result = await sendAuthCredentials(login, password);
        if (result.payload.error) {
          reject({ _error: result.payload.error });
        } else {
          this.onSubmitSuccess(result);
          resolve(result);
        }
      } catch (e) {
        reject({ _error: 'Un expected error' });
      }
    });
  };

  render() {
    return (
      <CenterWrapper>
        <h1>Qorus web application</h1>
        <LoginForm onSubmit={this.handleSubmit} />
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
