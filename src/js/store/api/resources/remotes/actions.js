/* @flow */
import { createAction } from 'redux-actions';
import pickBy from 'lodash/pickBy';

import { fetchJson } from '../../utils';
import settings from '../../../../settings';
import { error } from '../../../ui/bubbles/actions';
import { attrsSelector } from '../../../../helpers/remotes';

const ping: Function = (model: string, type: string) =>
  fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/remote/${type}/${model}?action=ping`
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

const manageConnectionCall: Function = createAction(
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
      response = await fetchJson(
        'POST',
        `${settings.REST_BASE_URL}/remote/${remoteType}`,
        {
          body: JSON.stringify(newData),
        },
        true
      );
    } else {
      newData = pickBy(data, (val, key) => editable.includes(key));
      response = await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/remote/${remoteType}/${name}`,
        {
          body: JSON.stringify(newData),
        },
        true
      );
    }

    if (response.err) {
      dispatch(error(response.desc));
    }

    return {
      remoteType,
      data,
      name,
      error: !!response.err,
    };
  }
);

const deleteConnectionAction: Function = createAction(
  'REMOTES_DELETECONNECTION',
  async (remoteType: string, name: string, dispatch): Object => {
    const response = await fetchJson(
      'DELETE',
      `${settings.REST_BASE_URL}/remote/${remoteType}/${name}`,
      null,
      true
    );

    if (response.err) {
      dispatch(error(response.desc));
    }

    return {
      remoteType,
      name,
      error: !!response.err,
    };
  }
);

const manageConnection: Function = (
  remoteType: string,
  data: Object,
  name: string
): Function => (dispatch: Function): void => {
  dispatch(manageConnectionCall(remoteType, data, name));
  dispatch(manageConnectionCall(remoteType, data, name, dispatch));
};

const deleteConnection: Function = (
  remoteType: string,
  name: string
): Function => (dispatch: Function): void => {
  dispatch(deleteConnectionAction(remoteType, name, dispatch));
};

export {
  pingRemote,
  connectionChange,
  updateDone,
  addAlert,
  clearAlert,
  manageConnection,
  deleteConnection,
};
