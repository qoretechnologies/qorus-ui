import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const clear = (datasource, name) => {
  fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/system/sqlcache/`,
    {
      body: JSON.stringify({
        action: 'clearCache',
        datasource,
        name,
      }),
    }
  );

  return {
    datasource,
    name,
  };
};

const clearCache = createAction('SQLCACHE_CLEARCACHE', clear);

export {
  clearCache,
};
