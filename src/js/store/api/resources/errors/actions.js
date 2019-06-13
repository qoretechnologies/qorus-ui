/* @flow */
import { createAction } from 'redux-actions';

import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';

const fetch: Function = createAction(
  'ERRORS_FETCH',
  async (type: string, id: number | string): Object => {
    const errors = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/errors/${type}${
        id && id !== 'omit' ? `/${id}` : ''
      }`
    );

    return { type, errors };
  }
);

const createOrUpdate: Function = createAction(
  'ERRORS_CREATEORUPDATE',
  async (
    type: string,
    id: number | string,
    data: Object,
    onSuccess: Function,
    dispatch: Function
  ): ?Object => {
    const dt =
      type === 'workflow' ? { ...data, ...{ forceworkflow: true } } : data;

    const result = await fetchWithNotifications(
      async () => {
        const res = await fetchJson(
          'POST',
          `${settings.REST_BASE_URL}/errors/${type}${
            id && id !== 'omit' ? `/${id}` : ''
          }?action=createOrUpdate`,
          { body: JSON.stringify(dt) }
        );

        if (!res.err) {
          onSuccess();
        }

        return res;
      },
      'Saving changes...',
      'Changes saved',
      dispatch
    );

    if (result.err) {
      return {};
    }

    return { type, id, data };
  }
);

const removeError: Function = createAction(
  'ERRORS_REMOVE',
  async (
    type: string,
    id: number | string,
    name: string,
    dispatch: Function
  ): ?Object => {
    if (!dispatch) {
      return { type, name };
    }

    await fetchWithNotifications(
      async () =>
        await fetchJson(
          'DELETE',
          `${settings.REST_BASE_URL}/errors/${type}${
            id && id !== 'omit' ? `/${id}` : ''
          }/${name}`
        ),
      'Deleting error...',
      'Error deleted',
      dispatch
    );

    return {};
  }
);

const unsync: Function = createAction('ERRORS_UNSYNC');

export { fetch, createOrUpdate, removeError, unsync };
