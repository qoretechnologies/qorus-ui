// @flow
import { createAction } from 'redux-actions';

import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';

const remove: Function = createAction(
  'SLAS_REMOVE',
  (id: number, dispatch: Function): Object => {
    fetchWithNotifications(
      async () =>
        await fetchJson('DELETE', `${settings.REST_BASE_URL}/slas/${id}`),
      'Deleting...',
      'SLA deleted',
      dispatch
    );

    return { id };
  }
);

const create: Function = createAction(
  'SLAS_CREATE',
  async (
    name: string,
    description: string,
    units: string,
    dispatch: Function
  ): Object => {
    if (!dispatch) {
      return {
        name,
        description,
        units,
      };
    }

    const res = await fetchWithNotifications(
      async () =>
        await fetchJson('POST', `${settings.REST_BASE_URL}/slas/`, {
          body: JSON.stringify({
            name,
            description,
            units,
          }),
        }),
      'Creating new SLA...',
      'SLA created',
      dispatch
    );

    return { name, ...res };
  }
);

const unsync = createAction('SLAS_UNSYNC');

export { remove, create, unsync };
