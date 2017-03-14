import { handleActions } from 'redux-actions';

import actions from '../../../constants/sort';
import { buildSorting } from '../../../helpers/table';

const initialState = {};
const handlers = {};

handlers[actions.CHANGE_SORT] = (state, { payload: { tableName, ...sortOption } }) => {
  const option = buildSorting(sortOption, tableName, state);
  const newState = { ...state, ...{ [tableName]: option } };

  return newState;
};

handlers[actions.INIT_SORT] = (state, { payload: { tableName, sortData } }) => ({
  ...state,
  ...{ [tableName]: sortData },
});

export default handleActions(handlers, initialState);
