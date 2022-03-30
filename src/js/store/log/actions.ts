/* @flow */
import { createAction } from 'redux-actions';

const init: Object = createAction(
  'LOG_INIT',
  (url: string): Object => ({ url })
);

const onMessage: Object = createAction(
  'LOG_MESSAGE',
  (url: string, msg: string): Object => ({ url, msg })
);

const clear: Object = createAction(
  'LOG_CLEAR',
  (url: string): Object => ({ url })
);

const onDisconnect: Object = createAction(
  'LOG_DISCONNECT',
  (url: string): Object => ({ url })
);

export {
  onMessage,
  init,
  onDisconnect,
  clear,
};
