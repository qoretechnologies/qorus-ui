/* @flow */
import React, { Component } from 'react';

import { LoginWrapper } from '../../components/auth';
import LoginForm from './form';

export default class Login extends Component {
  handleSubmit: Function = ({ login, password }: { login: string, password: string }): void => {
    console.log(`Credentials: ${login}/${password}`);
  };

  render() {
    return (
      <LoginWrapper>
        <h1>Qorus web application</h1>
        <LoginForm onSubmit={this.handleSubmit} />
      </LoginWrapper>
    );
  }
}
