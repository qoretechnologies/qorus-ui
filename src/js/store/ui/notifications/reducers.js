/* @flow */
import shortid from 'shortid';
import { handleActions } from 'redux-actions';

import actions from '../../../constants/notifications';

const initialState = {};

type Action = {
  type: string,
  payload: Object
}

function addNotification(state: Object, action: Action): Object {
  const { payload } = action;
  const list = state.list || [];
  const notification = Object.assign({}, payload, { id: shortid.generate() });
  return Object.assign({}, state, { list: [notification, ...list] });
}

function deleteNotification(state: Object, action: Action): Object {
  const { payload: removeId } = action;
  const list = state.list || [];
  return Object.assign({}, state, { list: list.filter(item => item.id !== removeId) });
}


export default handleActions(
  {
    [actions.ADD_NOTIFICATION]: addNotification,
    [actions.DELETE_NOTIFICATION]: deleteNotification,
  },
  initialState
);
