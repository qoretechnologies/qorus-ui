import { reduxForm } from 'redux-form';

import { LoginForm } from 'components/auth';

export default reduxForm({
  form: 'login',
  fields: ['login', 'password'],
})(LoginForm);
