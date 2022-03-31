// @flow
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import { fetchJson, fetchWithNotifications } from '../../utils';

const remove: Function = createAction('SLAS_REMOVE', (id: number, dispatch: Function): any => {
  fetchWithNotifications(
    async () =>
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
      await fetchJson('DELETE', `${settings.REST_BASE_URL}/slas/${id}`),
    'Deleting...',
    'SLA deleted',
    dispatch
  );

  return { id };
});

const create: Function = createAction(
  'SLAS_CREATE',
  async (
    name: string,
    description: string,
    units: string,
    dispatch: Function
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): any => {
    if (!dispatch) {
      return {
        name,
        description,
        units,
      };
    }

    const res = await fetchWithNotifications(
      async () =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
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
