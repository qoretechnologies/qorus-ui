/* @flow */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { CenterWrapper } from '../../components/layout';
import actions from '../../store/api/actions';
import LoginForm from './form';

class Login extends Component {
  static defaultProps = {
    setToken: () => {},
  }

  props: {
    sendAuthCredentials: () => Promise<*>,
    setToken: Function,
  }

  handleSubmit = (
    { login, password }: { login: string, password: string }
  ): Promise<*> => {
    const { sendAuthCredentials, setToken } = this.props;
    return new Promise(async (resolve, reject) => {
      try {
        const result = await sendAuthCredentials(login, password);
        if (result.payload.error) {
          reject({ _error: result.payload.error });
        }
        setToken(result.payload.token);
        resolve(result);
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
  sendAuthCredentials: PropTypes.func.isRequired,
  setToken: PropTypes.func,
};

export default connect(
  () => ({}),
  actions.auth
)(Login);
