import { createAction } from 'redux-actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';

const clearCache = createAction(
  'SQLCACHE_CLEARCACHE',
  async (datasource, name, dispatch) => {
    if (!dispatch) {
      return {
        datasource,
        name,
      };
    }

    await fetchWithNotifications(
      async () =>
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
  }
);

export { clearCache };
