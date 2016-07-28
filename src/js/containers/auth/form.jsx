/* @flow */
import React from 'react';
import classNames from 'classnames';
import { reduxForm } from 'redux-form';

import Alert from '../../components/alert';

export const LoginForm = ({
  handleSubmit,
  submitting,
  error,
  fields: { login, password },
}: {
  handleSubmit: Function,
  submitting: boolean,
  error: any,
  fields: {
    login: any,
    password: any,
  }
}) => {
  let errorAlert: ?any;

  if (error) {
    errorAlert = <Alert bsStyle="warning">{error}</Alert>;
  }
  return (
    <form onSubmit={handleSubmit} className="loginForm">
      {errorAlert}
      <div className="form-group">
        <input
          type="text"
          placeholder="Login"
          className="form-control"
          {...login}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          className="form-control"
          {...password}
        />
      </div>
      <div className="form-group">
        <button
          className={classNames({
            btn: true,
            'btn-block': true,
            'btn-primary': true,
          })}
          disabled={submitting}
          type="submit"
        >
          Log In
        </button>
      </div>
    </form>
  );
};

export default reduxForm({
  form: 'login',
  fields: ['login', 'password'],
})(LoginForm);
