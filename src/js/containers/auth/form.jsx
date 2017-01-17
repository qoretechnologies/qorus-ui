/* @flow */
import React from 'react';
import { reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const inputRootStyle = {
  fontWeight: 300,
  fontSize: '14px',
};

const inputStyle = {
  color: '#fff',
};

const labelShrinkStyle = {
  color: '#9ccb3b',
  fontSize: '16px',
};

const labelFocusStyle = {
  color: '#555',
  fontWeight: '300',
};

const underlineStyle = {
  borderBottomWidth: '2px',
  opacity: '.4',
};

const underlineFocusStyle = {
  borderColor: '#9ccb3b',
};

const buttonStyle = {
  marginTop: '14px',
};

const labelStyle = {
  color: '#fff',
  fontWeight: 600,
};

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
}) => (
  <form onSubmit={handleSubmit} className="loginForm">
    <TextField
      style={inputRootStyle}
      inputStyle={inputStyle}
      fullWidth
      floatingLabelText="Username"
      floatingLabelShrinkStyle={labelShrinkStyle}
      floatingLabelStyle={labelFocusStyle}
      underlineStyle={underlineStyle}
      underlineFocusStyle={underlineFocusStyle}
      autoComplete="off"
      {...login}
    />
    <TextField
      style={inputRootStyle}
      inputStyle={inputStyle}
      fullWidth
      type="password"
      floatingLabelText="Password"
      floatingLabelShrinkStyle={labelShrinkStyle}
      floatingLabelStyle={labelFocusStyle}
      errorText={error}
      underlineStyle={underlineStyle}
      underlineFocusStyle={underlineFocusStyle}
      autoComplete="off"
      {...password}
    />
    <RaisedButton
      backgroundColor="#6172bf"
      style={buttonStyle}
      labelStyle={labelStyle}
      label="LOG IN"
      fullWidth
      type="submit"
      disabled={submitting}
    />
  </form>
);

export default reduxForm({
  form: 'login',
  fields: ['login', 'password'],
})(LoginForm);
