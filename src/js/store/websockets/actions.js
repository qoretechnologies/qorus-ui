/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../settings';

const connections = {};

const connected = createAction(
  'WEBSOCKET_CONNECTED',
  url => ({ url })
);

const disconnected = createAction(
  'WEBSOCKET_DISCONNECTED',
  (url: string, code: number) => {
    delete connections[url];
    return { url, code };
  }
);

const paused = createAction(
  'WEBSOCKET_PAUSED',
  url => {
    delete connections[url];
    return { url };
  }
);

const connectCall: Function = (
  url: string,
  dispatch: Function,
  onOpen: Function,
  onMessage: Function,
  onError: Function,
  onClose: Function,
  onPause: Function,
): Object => {
  const token = localStorage.getItem('token') || 'undefined';

  connections[url] = new WebSocket(
    `${settings.WS_BASE_URL}/${url}?token=${token}`
  );

  const ws = connections[url];

  ws.onopen = () => {
    dispatch(connected(url));

    if (onOpen) onOpen(url);
  };

  ws.onmessage = ({ data }) => {
    if (onMessage) onMessage(url, data);
  };

  ws.onclose = ({ code, reason }: { code: number, reason: string }) => {
    if (code !== 1000) {
      dispatch(disconnected(url, code));

      if (onError) onError(url, code);
    }

    switch (reason) {
      case 'paused':
        dispatch(paused(url));

        if (onPause) onPause(url);
        break;
      default:
        dispatch(disconnected(url, code));

        if (onClose) onClose(url);
        break;
    }
  };

  return { url };
};

const disconnectCall: Function = (url: string, pause: boolean): void => {
  if (connections[url]) connections[url].close(1000, pause ? 'paused' : '');
};

const connectAction: Function = createAction(
  'WEBSOCKET_CONNECTING',
  connectCall
);

const connect: Function = (
  url: string,
  onOpen: Function,
  onMessage: Function,
  onError: Function,
  onClose: Function,
  onPause: Function,
): Function => (dispatch: Function) => {
  dispatch(connectAction(
    url,
    dispatch,
    onOpen,
    onMessage,
    onError,
    onClose,
    onPause,
  ));
};

const disconnectAction: Function = createAction(
  'WEBSOCKET_DISCONNECTING',
  disconnectCall
);

const disconnect: Function = (url: string, pause: boolean): Function => (dispatch: Function) => {
  dispatch(disconnectAction(url, pause));
};

export {
  connect,
  disconnect,
};
