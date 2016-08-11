import { handleActions } from 'redux-actions';

import actions from '../../../constants/sort';

const initialState = {};

const handlers = {};

handlers[actions.CHANGE_SORT] = (state, { payload: { tableName, ...sortOption } }) => {
  const newState = { ...state, ...{ [tableName]: sortOption } };
  return newState;
};

export default handleActions(handlers, initialState);
