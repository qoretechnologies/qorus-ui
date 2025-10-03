/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import { fetchJson } from '../../utils';

const logout = createAction('AUTH_LOGOUT', async () => {
  await fetchJson('POST', `${settings.REST_BASE_URL}/logout`);

  window.location.href = '/login?logout=true';
});

export { logout };
