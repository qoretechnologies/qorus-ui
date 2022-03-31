/* @flow */
import { createAction } from 'redux-actions';

const init: any = createAction('LOG_INIT', (url: string): any => ({ url }));

const onMessage: any = createAction('LOG_MESSAGE', (url: string, msg: string): any => ({
  url,
  msg,
}));

const clear: any = createAction('LOG_CLEAR', (url: string): any => ({ url }));

const onDisconnect: any = createAction('LOG_DISCONNECT', (url: string): any => ({ url }));

export { onMessage, init, onDisconnect, clear };
