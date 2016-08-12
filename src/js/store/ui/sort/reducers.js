import { handleActions } from 'redux-actions';

import actions from '../../../constants/sort';

const initialState = {};

const handlers = {};

handlers[actions.CHANGE_SORT] = (state, { payload: { tableName, ...sortOption } }) => {
  const option = { ...sortOption };
  const currentOption = state[tableName];

  if (currentOption && currentOption.sortBy !== sortOption.sortBy) {
    option.historySortBy = currentOption.sortBy;
    option.historySortByKey = currentOption.sortByKey;
  }
  const newState = { ...state, ...{ [tableName]: option } };
  return newState;
};

export default handleActions(handlers, initialState);
