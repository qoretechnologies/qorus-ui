/* @flow */
import { createAction } from 'redux-actions';
import pickBy from 'lodash/pickBy';

import { fetchJson, fetchWithNotifications, put, get } from '../../utils';
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

const enabledChange = createAction('REMOTES_ENABLEDCHANGE', events => ({
  events,
}));

const addConnection = createAction('REMOTES_ADDCONNECTION', events => ({
  events,
}));
const updateConnection = createAction('REMOTES_UPDATECONNECTION', events => ({
  events,
}));
const removeConnectionWS = createAction(
  'REMOTES_REMOVECONNECTIONWS',
  events => ({
    events,
  })
);

const updateDone: Function = createAction(
  'REMOTES_UPDATEDONE',
  (name: string): Object => ({ name })
);

const fetchPass: Function = createAction(
  'REMOTES_FETCHPASS',
  async (
    remoteType: string,
    name: string,
    withPass: boolean,
    dispatch: Function
  ): Object => {
    const model = await fetchWithNotifications(
      async () =>
        get(
          `${
            settings.REST_BASE_URL
          }/remote/${remoteType}/${name}?with_password=${
            withPass ? 'true' : 'false'
          }`
        ),
      null,
      null,
      dispatch
    );

    return { model };
  }
);

const addAlert = createAction('REMOTES_ADDALERT', events => ({ events }));

const clearAlert = createAction('REMOTES_CLEARALERT', events => ({ events }));

const manageConnection: Function = createAction(
  'REMOTES_MANAGECONNECTION',
  (remoteType: string, data: Object, name: string, dispatch: Function) => {
    const { editable } = attrsSelector(null, { remoteType });
    let newData = data;

    if (!name) {
      fetchWithNotifications(
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
      fetchWithNotifications(
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
  }
);

const deleteConnection: Function = createAction(
  'REMOTES_DELETECONNECTION',
  (remoteType: string, name: string, dispatch): ?Object => {
    fetchWithNotifications(
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

    return;
  }
);

const toggleConnection: Function = createAction(
  'REMOTES_TOGGLECONNECTION',
  (
    name: string,
    value: boolean,
    remoteType: string,
    dispatch: Function
  ): void => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/remote/${remoteType}/${name}?action=${
            value ? 'enable' : 'disable'
          }`
        ),
      `${value ? 'Enabling' : 'Disabling'} ${name}...`,
      `${name} successfuly ${value ? 'enabled' : 'disabled'}`,
      dispatch
    );

    return;
  }
);

const resetConnection: Function = createAction(
  'REMOTES_RESETCONNECTION',
  (remoteType: string, name: string, dispatch: Function): void => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/remote/${remoteType}/${name}?action=reset`
        ),
      `Reseting ${name}...`,
      `${name} successfuly reset`,
      dispatch
    );

    return;
  }
);

export {
  pingRemote,
  connectionChange,
  enabledChange,
  updateDone,
  addAlert,
  clearAlert,
  manageConnection,
  deleteConnection,
  toggleConnection,
  resetConnection,
  fetchPass,
  addConnection,
  updateConnection,
  removeConnectionWS,
};
