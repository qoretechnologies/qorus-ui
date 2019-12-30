/* @flow */
import { createAction } from 'redux-actions';
import pickBy from 'lodash/pickBy';

import { fetchJson, fetchWithNotifications, put, get } from '../../utils';
import settings from '../../../../settings';
import { attrsSelector } from '../../../../helpers/remotes';
import { CONN_MAP_REVERSE } from '../../../../constants/remotes';
import {
  fetchLoggerAction,
  deleteLoggerAction,
  addUpdateLoggerAction,
  addAppenderAction,
  editAppenderAction,
  deleteAppenderAction,
} from '../../common/actions';

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

const debugChange = createAction('REMOTES_DEBUGCHANGE', events => ({
  events,
}));

const enabledChange = createAction('REMOTES_ENABLEDCHANGE', events => ({
  events,
}));

const addConnection = createAction('REMOTES_ADDCONNECTION', events => ({
  events,
}));
const updateConnection = createAction(
  'REMOTES_UPDATECONNECTION',
  async events => {
    let models: Array<Object> = events;

    //! If we are on HTTPS, fetch the connection with password
    if (!settings.IS_HTTP) {
      models = await Promise.all(
        models.map(async (model: Object) => {
          const safeUrl: string = await get(
            `${settings.REST_BASE_URL}/remote/${
              CONN_MAP_REVERSE[model.conntype]
            }/${model.name}/url?with_password=true`
          );

          return {
            ...model,
            safeUrl,
          };
        })
      );
    }

    return { models };
  }
);
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
  async (remoteType: string, name: string, dispatch: Function): Object => {
    const safeUrl = await fetchWithNotifications(
      async () =>
        get(
          `${settings.REST_BASE_URL}/remote/${remoteType}/${name}/url?with_password=true`
        ),
      null,
      null,
      dispatch
    );

    return { safeUrl, name, remoteType };
  }
);

const addAlert = createAction('REMOTES_ADDALERT', events => ({ events }));

const clearAlert = createAction('REMOTES_CLEARALERT', events => ({ events }));

const manageConnection: Function = createAction(
  'REMOTES_MANAGECONNECTION',
  (
    remoteType: string,
    data: Object,
    name: string,
    onSuccess: Function,
    dispatch: Function
  ) => {
    const { editable } = attrsSelector(null, { remoteType });
    let newData = data;

    if (!name) {
      fetchWithNotifications(
        async () => {
          const res = await fetchJson(
            'POST',
            `${settings.REST_BASE_URL}/remote/${remoteType}`,
            {
              body: JSON.stringify(newData),
            }
          );

          if (!res.err && onSuccess) {
            onSuccess();
          }

          return res;
        },
        `Creating ${data.name}...`,
        `${data.name} successfuly created`,
        dispatch
      );
    } else {
      newData = pickBy(data, (val, key) => editable.includes(key));

      fetchWithNotifications(
        async () => {
          const res = await fetchJson(
            'PUT',
            `${settings.REST_BASE_URL}/remote/${remoteType}/${name}`,
            {
              body: JSON.stringify(newData),
            }
          );

          if (!res.err && onSuccess) {
            onSuccess();
          }

          return res;
        },
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
  }
);

const toggleDebug: Function = createAction(
  'REMOTES_TOGGLEDEBUG',
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
            value ? 'enableDebugData' : 'disableDebugData'
          }`
        ),
      `${value ? 'Enabling' : 'Disabling'} debug data for ${name}...`,
      `Successfuly ${value ? 'enabled' : 'disabled'} debug data`,
      dispatch
    );
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
  }
);

const fetchLogger = fetchLoggerAction('remotes', 'remote/datasources');
const addUpdateLogger = addUpdateLoggerAction('remotes', 'remote/datasources');
const deleteLogger = deleteLoggerAction('remotes', 'remote/datasources');
const addAppender = addAppenderAction('remotes', 'remote/datasources');
const editAppender = editAppenderAction('remotes', 'remote/datasources');
const deleteAppender = deleteAppenderAction('remotes', 'remote/datasources');

export {
  pingRemote,
  connectionChange,
  debugChange,
  enabledChange,
  updateDone,
  addAlert,
  clearAlert,
  manageConnection,
  deleteConnection,
  toggleConnection,
  resetConnection,
  toggleDebug,
  fetchPass,
  addConnection,
  updateConnection,
  removeConnectionWS,
  fetchLogger,
  addUpdateLogger,
  deleteLogger,
  addAppender,
  editAppender,
  deleteAppender,
};
