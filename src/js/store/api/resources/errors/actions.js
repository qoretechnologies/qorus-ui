/* @flow */
import { createAction } from 'redux-actions';

import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const fetch: Function = createAction(
  'ERRORS_FETCH',
  async (type: string, id: number | string): Object => {
    const errors = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/errors/${type}${id && id !== 'omit' ? `/${id}` : ''}`
    );

    return { type, errors };
  }
);

const createOrUpdate: Function = createAction(
  'ERRORS_CREATEORUPDATE',
  (type: string, id: number | string, data: Object): Object => {
    const dt = type === 'workflow' ? { ...data, ...{ forceworfklow: true } } : data;

    fetchJson(
      'POST',
      `${settings.REST_BASE_URL}/errors/${type}${
        id && id !== 'omit' ? `/${id}` : ''
      }?action=createOrUpdate`,
      { body: JSON.stringify(dt) }
    );

    return { type, id, data };
  }
);

const removeError: Function = createAction(
  'ERRORS_REMOVE',
  (type: string, id: number | string, name: string): Object => {
    fetchJson(
      'DELETE',
      `${settings.REST_BASE_URL}/errors/${type}${
        id && id !== 'omit' ? `/${id}` : ''
        }/${name}`
    );

    return { type, name };
  }
);

const unsync: Function = createAction('ERRORS_UNSYNC');

export {
  fetch,
  createOrUpdate,
  removeError,
  unsync,
};
