/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import { fetchJson } from '../../utils';

const logout = createAction('AUTH_LOGOUT', (): void => {
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  fetchJson('POST', `${settings.REST_BASE_URL}/logout`);

  window.localStorage.removeItem('token');
  window.location.href = '/login?logout=true';
});

export { logout };
