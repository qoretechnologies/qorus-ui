import keyMirror from 'keymirror';

const ACTIONS = keyMirror({
  WEBSOCKET_CONNECTING: null,
  WEBSOCKET_CONNECTED: null,
  WEBSOCKET_DISCONNECTED: null,
  WEBSOCKET_PAUSED: null,
});

const DEFAULTSTATE = {
  connected: false,
  loading: false,
  error: false,
  paused: false,
};

export {
  ACTIONS,
  DEFAULTSTATE,
};
