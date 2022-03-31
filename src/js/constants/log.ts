/* @flow */
import keyMirror from 'keymirror';

const ACTIONS: any = keyMirror({
  LOG_MESSAGE: null,
  LOG_INIT: null,
  LOG_CLEAR: null,
});

const DEFAULTSTATE: any = {
  messages: ['-- READY TO RECEIVE DATA --'],
};

const LABELS: any = {
  paused: '-- PAUSED --',
  resumed: '-- RESUMED --',
  cleared: '-- LOG CLEARED --',
};

export { ACTIONS, DEFAULTSTATE, LABELS };
