/* @flow */
import keyMirror from 'keymirror';

const ACTIONS: Object = keyMirror({
  LOG_MESSAGE: null,
  LOG_INIT: null,
  LOG_CLEAR: null,
});

const DEFAULTSTATE: Object = {
  messages: ['-- READY TO RECEIVE DATA --'],
};

const LABELS: Object = {
  paused: '-- PAUSED --',
  resumed: '-- RESUMED --',
  cleared: '-- LOG CLEARED --',
};

export {
  ACTIONS,
  DEFAULTSTATE,
  LABELS,
};
