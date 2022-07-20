import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import { fetchJson, fetchWithNotifications } from '../../utils';

const clearCache = createAction('SQLCACHE_CLEARCACHE', async (datasource, name, dispatch) => {
  if (!dispatch) {
    return {
      datasource,
      name,
    };
  }

  await fetchWithNotifications(
    async () =>
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      await fetchJson('PUT', `${settings.REST_BASE_URL}/system/sqlcache/`, {
        body: JSON.stringify({
          action: 'clearCache',
          datasource,
          name,
        }),
      }),
    'Clearing cache...',
    'Cache cleared',
    dispatch
  );

  return {
    datasource,
    name,
  };
});

export { clearCache };
