/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

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
  (name: string, up: boolean) => ({ name, up })
);

const updateDone: Function = createAction(
  'REMOTES_UPDATEDONE',
  (name: string): Object => ({ name })
);

const addAlert = createAction(
  'REMOTES_ADDALERT',
  (data) => ({ data })
);

const clearAlert = createAction(
  'REMOTES_CLEARALERT',
  (id, type, alertid) => ({ id, type, alertid })
);

export {
  pingRemote,
  connectionChange,
  updateDone,
  addAlert,
  clearAlert,
};
