/* @flow */
import { handleActions } from 'redux-actions';
import { ACTIONS, DEFAULTSTATE } from '../../constants/log';

const initialState: Object = {};

const data = handleActions({
  [ACTIONS.LOG_INIT]: (state: Object, { payload: { url } }) => (
    { ...state, ...{ [url]: DEFAULTSTATE } }
  ),
  [ACTIONS.LOG_MESSAGE]: (state: Object, { payload: { url, msg } }) => {
    const messages = state[url].messages.slice();
    messages.push(msg);

    return { ...state, ...{ [url]: { messages } } };
  },
  [ACTIONS.LOG_CLEAR]: (state: Object, { payload: { url } }) => (
    { ...state, ...{ [url]: DEFAULTSTATE } }
  ),
}, initialState);

export {
  data,
};
