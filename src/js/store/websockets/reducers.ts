/* @flow */
import { handleActions } from 'redux-actions';
import { ACTIONS, DEFAULTSTATE } from '../../constants/websockets';

const initialState: any = {};

const data = handleActions(
  {
    [ACTIONS.WEBSOCKET_CONNECTING]: (state: any, { payload: { url } }) => ({
      ...state,
      ...{ [url]: { loading: true, connected: false, error: false, paused: false } },
    }),
    [ACTIONS.WEBSOCKET_CONNECTED]: (state: any, { payload: { url } }) => ({
      ...state,
      ...{ [url]: { loading: false, connected: true, error: false, paused: false } },
    }),
    [ACTIONS.WEBSOCKET_PAUSED]: (state: any, { payload: { url } }) => ({
      ...state,
      ...{ [url]: { loading: false, connected: false, error: false, paused: true } },
    }),
    [ACTIONS.WEBSOCKET_DISCONNECTED]: (state: any, { payload: { url, code } }) => {
      if (code !== 1000) {
        return {
          ...state,
          ...{
            [url]: {
              loading: false,
              connected: false,
              error: `Error: connection to the server was terminated - Error Code #${code}`,
              paused: false,
            },
          },
        };
      }

      return { ...state, ...{ [url]: DEFAULTSTATE } };
    },
  },
  initialState
);

export { data };
