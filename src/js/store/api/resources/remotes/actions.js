/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';
import { error } from '../../../ui/bubbles/actions';

const ping: Function = (model: string, type: string) => (fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/remote/${type}/${model}?action=ping`
  )
);

const pingRemote = createAction(
  'REMOTES_PINGREMOTE',
  ping
);

const connectionChange = createAction(
  'REMOTES_CONNECTIONCHANGE',
  (events) => ({ events })
);

const updateDone: Function = createAction(
  'REMOTES_UPDATEDONE',
  (name: string): Object => ({ name })
);

const addAlert = createAction(
  'REMOTES_ADDALERT',
  (events) => ({ events })
);

const clearAlert = createAction(
  'REMOTES_CLEARALERT',
  (events) => ({ events })
);

const manageConnectionCall: Function = createAction(
  'REMOTES_MANAGECONNECTION',
  async (remoteType: string, data: Object, name: string, dispatch: Function) => {
    if (!dispatch) {
      return {
        remoteType,
        data,
        name,
      };
    }

    let response: Object;

    if (!name) {
      response = await fetchJson(
        'POST',
        `${settings.REST_BASE_URL}/remote/${remoteType}`,
        {
          body: JSON.stringify(data),
        },
        true
      );
    } else {
      response = await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/remote/${remoteType}/${name}`,
        {
          body: JSON.stringify(data),
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

const manageConnection: Function = (
  remoteType: string,
  data: Object,
  name: string,
): Function => (dispatch: Function): void => {
  dispatch(manageConnectionCall(remoteType, data, name));
  dispatch(manageConnectionCall(remoteType, data, name, dispatch));
};

export {
  pingRemote,
  connectionChange,
  updateDone,
  addAlert,
  clearAlert,
  manageConnection,
};
