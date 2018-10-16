/* @flow */
import { handleActions } from 'redux-actions';

import actions from '../../../constants/bubbles';
import { updateItemWithId } from '../../api/utils';

const initialState = {};

type Action = {
  type: string,
  payload: Object,
};

function addBubble(state: Object, action: Action): Object {
  const { payload } = action;
  let newList = state.list || [];

  // * Check if the notification already exists for this ID
  const notification = newList.find(
    (listItem: Object): boolean => listItem.id === payload.id
  );

  if (notification) {
    newList = updateItemWithId(payload.id, payload, newList);
  } else {
    newList = [payload, ...newList];
  }

  return Object.assign({}, state, { list: newList });
}

function deleteBubble(state: Object, action: Action): Object {
  const { payload: removeId } = action;
  const list = state.list || [];
  return Object.assign({}, state, {
    list: list.filter(item => item.id !== removeId),
  });
}

export default handleActions(
  {
    [actions.ADD_BUBBLE]: addBubble,
    [actions.DELETE_BUBBLE]: deleteBubble,
  },
  initialState
);
