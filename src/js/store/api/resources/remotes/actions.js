/* @flow */
import { createAction } from 'redux-actions';
import pickBy from 'lodash/pickBy';

import { fetchJson, fetchWithNotifications, put } from '../../utils';
import settings from '../../../../settings';
import { attrsSelector } from '../../../../helpers/remotes';

const ping: Function = (model: string, type: string, dispatch: Function) =>
  fetchWithNotifications(
    async () =>
      await put(
        `${settings.REST_BASE_URL}/remote/${type}/${model}?action=ping`
      ),
    `Requesting ping for ${model}...`,
    `Successfuly requested ping for ${model}`,
    dispatch
  );

const pingRemote = createAction('REMOTES_PINGREMOTE', ping);

const connectionChange = createAction('REMOTES_CONNECTIONCHANGE', events => ({
  events,
}));

const updateDone: Function = createAction(
  'REMOTES_UPDATEDONE',
  (name: string): Object => ({ name })
);

const addAlert = createAction('REMOTES_ADDALERT', events => ({ events }));

const clearAlert = createAction('REMOTES_CLEARALERT', events => ({ events }));

const manageConnection: Function = createAction(
  'REMOTES_MANAGECONNECTION',
  async (
    remoteType: string,
    data: Object,
    name: string,
    dispatch: Function
  ) => {
    if (!dispatch) {
      return {
        remoteType,
        data,
        name,
      };
    }

    let response: Object;
    const { editable } = attrsSelector(null, { remoteType });
    let newData = data;

    if (!name) {
      response = await fetchWithNotifications(
        async () =>
          await fetchJson(
            'POST',
            `${settings.REST_BASE_URL}/remote/${remoteType}`,
            {
              body: JSON.stringify(newData),
            }
          ),
        `Creating ${data.name}...`,
        `${data.name} successfuly created`,
        dispatch
      );
    } else {
      newData = pickBy(data, (val, key) => editable.includes(key));
      response = await fetchWithNotifications(
        async () =>
          await fetchJson(
            'PUT',
            `${settings.REST_BASE_URL}/remote/${remoteType}/${name}`,
            {
              body: JSON.stringify(newData),
            }
          ),
        `Saving ${name}...`,
        `${name} successfuly modified`,
        dispatch
      );
    }

    return {
      remoteType,
      data,
      name,
      error: !!response.err,
    };
  }
);

const deleteConnection: Function = createAction(
  'REMOTES_DELETECONNECTION',
  async (remoteType: string, name: string, dispatch): Object => {
    const response = await fetchWithNotifications(
      async () =>
        await fetchJson(
          'DELETE',
          `${settings.REST_BASE_URL}/remote/${remoteType}/${name}`,
          null,
          true
        ),
      `Deleting ${name}...`,
      `${name} successfuly deleted`,
      dispatch
    );

    return {
      remoteType,
      name,
      error: !!response.err,
    };
  }
);

const toggleConnection: Function = createAction(
  'REMOTES_TOGGLECONNECTION',
  (name: string, value: boolean, dispatch: Function): void => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/remote/user/${name}?action=${
            value ? 'enable' : 'disable'
          }`
        ),
      `${value ? 'Enabling' : 'Disabling'} ${name}`,
      `${name} successfuly ${value ? 'enabled' : 'disabled'}`,
      dispatch
    );

    return;
  }
);

export {
  pingRemote,
  connectionChange,
  updateDone,
  addAlert,
  clearAlert,
  manageConnection,
  deleteConnection,
  toggleConnection,
};
