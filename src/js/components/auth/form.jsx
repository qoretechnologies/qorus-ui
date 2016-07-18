/* @flow */
import React from 'react';
import classNames from 'classnames';

const LoginForm = ({
  handleSubmit,
  submitting,
  fields: { login, password },
}: {
  handleSubmit: () => void,
  submitting: boolean,
  fields: {
    login: any,
    password: any,
  }
}) => (
  <form onSubmit={handleSubmit} className="loginForm">
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

export default LoginForm;
