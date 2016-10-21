/* @flow */
import { createAction } from 'redux-actions';

import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const fetchValues = createAction(
  'VALUEMAPS_FETCHVALUES',
  async (id: number): Object => {
    const values = await fetchJson('GET', `${settings.REST_BASE_URL}/valuemaps/${id}/values`);

    return { values, id };
  }
);

const getDump = createAction(
  'VALUEMAPS_GETDUMP',
  async (id: number): Object => {
    const dump = await fetchJson('GET', `${settings.REST_BASE_URL}/valuemaps/${id}?action=dump`);

    return { dump, id };
  }
);

const removeDump = createAction(
  'VALUEMAPS_REMOVEDUMP',
);

const updateValue = createAction(
  'VALUEMAPS_UPDATEVALUE',
  (id: number, key: string, value: string | number, enabled: boolean): Object => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/valuemaps/${id}`,
      {
        body: JSON.stringify({
          key,
          value,
          enabled,
          action: 'value',
        }),
      }
    );

    return {
      id,
      key,
      value,
      enabled,
    };
  }
);

const deleteValue = createAction(
  'VALUEMAPS_DELETEVALUE',
  (id: number, key: string): Object => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/valuemaps/${id}`,
      {
        body: JSON.stringify({
          key,
          action: 'value',
        }),
      }
    );

    return {
      id,
      key,
    };
  }
);

const addValue = createAction(
  'VALUEMAPS_ADDVALUE',
  (
    id: number,
    key: string,
    value: string,
    enabled: boolean
  ): Object => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/valuemaps/${id}`,
      {
        body: JSON.stringify({
          key,
          value,
          enabled,
          action: 'value',
        }),
      }
    );

    return {
      id,
      key,
      value,
      enabled,
    };
  }
);

export {
  fetchValues,
  addValue,
  updateValue,
  deleteValue,
  getDump,
  removeDump,
};
