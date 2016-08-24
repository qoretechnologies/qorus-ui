/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';

const ping = (model, type) => (fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/remote/${type}/${model}?action=ping`
  )
);

const pingRemote = createAction(
  'REMOTES_PINGREMOTE',
  ping
);

export {
  pingRemote,
};
