/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const logout = createAction(
  'AUTH_LOGOUT',
  (replace: Function): void => {
    fetchJson('POST', `${settings.REST_BASE_URL}/logout`);

    window.localStorage.removeItem('token');

    replace('/login');
  }
);

export { logout };
