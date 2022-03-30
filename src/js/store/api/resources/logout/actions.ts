/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const logout = createAction(
  'AUTH_LOGOUT',
  (): void => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
    fetchJson('POST', `${settings.REST_BASE_URL}/logout`);

    window.localStorage.removeItem('token');
    window.location.href = '/login?logout=true';
  }
);

export { logout };
