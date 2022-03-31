/* @flow */
import { handleActions } from 'redux-actions';
import { ACTIONS, DEFAULTSTATE } from '../../constants/log';

const initialState: any = {};

const data = handleActions(
  {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'LOG_INIT' does not exist on type 'Object... Remove this comment to see the full error message
    [ACTIONS.LOG_INIT]: (state: any, { payload: { url } }) => ({
      ...state,
      ...{ [url]: DEFAULTSTATE },
    }),
    // @ts-ignore ts-migrate(2339) FIXME: Property 'LOG_MESSAGE' does not exist on type 'Obj... Remove this comment to see the full error message
    [ACTIONS.LOG_MESSAGE]: (state: any, { payload: { url, msg } }) => {
      const messages = state[url].messages.slice();
      messages.push(msg);

      return { ...state, ...{ [url]: { messages } } };
    },
    // @ts-ignore ts-migrate(2339) FIXME: Property 'LOG_CLEAR' does not exist on type 'Objec... Remove this comment to see the full error message
    [ACTIONS.LOG_CLEAR]: (state: any, { payload: { url } }) => ({
      ...state,
      ...{ [url]: DEFAULTSTATE },
    }),
  },
  initialState
);

export { data };
