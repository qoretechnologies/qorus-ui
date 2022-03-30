/* @flow */
import { createAction } from 'redux-actions';

import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';

const fetchValues = createAction(
  'VALUEMAPS_FETCHVALUES',
  // @ts-expect-error ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  async (id: number): Object => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
    const values = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/valuemaps/${id}/values`
    );

    return { values, id };
  }
);

const getDump = createAction(
  'VALUEMAPS_GETDUMP',
  // @ts-expect-error ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  async (id: number): Object => {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
    const dump = await fetchJson(
      'GET',
      `${settings.REST_BASE_URL}/valuemaps/${id}?action=dump`
    );

    return { dump, id };
  }
);

const removeDump = createAction('VALUEMAPS_REMOVEDUMP');

const updateValue = createAction(
  'VALUEMAPS_UPDATEVALUE',
  async (
    id: number,
    key: string,
    value: string | number,
    enabled: boolean,
    dispatch: Function
  // @ts-expect-error ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): Object => {
    fetchWithNotifications(
      async () =>
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
        await fetchJson('PUT', `${settings.REST_BASE_URL}/valuemaps/${id}`, {
          body: JSON.stringify({
            key,
            value,
            enabled,
            action: 'value',
          }),
        }),
      `Updating ${key}...`,
      `${key} updated`,
      dispatch
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
  (id: number, key: string, dispatch: Function): Object => {
    fetchWithNotifications(
      async () =>
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
        await fetchJson('PUT', `${settings.REST_BASE_URL}/valuemaps/${id}`, {
          body: JSON.stringify({
            key,
            action: 'value',
          }),
        }),
      `Deleting ${key}...`,
      `${key} deleted`,
      dispatch
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
    enabled: boolean,
    dispatch: Function
  ): Object => {
    fetchWithNotifications(
      async () =>
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
        await fetchJson('PUT', `${settings.REST_BASE_URL}/valuemaps/${id}`, {
          body: JSON.stringify({
            key,
            value,
            enabled,
            action: 'value',
          }),
        }),
      `Creating ${key}...`,
      `${key} created`,
      dispatch
    );

    return {
      id,
      key,
      value,
      enabled,
    };
  }
);

export { fetchValues, addValue, updateValue, deleteValue, getDump, removeDump };
