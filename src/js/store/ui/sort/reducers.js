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
  } else {
    option.historySortBy = currentOption.historySortBy;
    option.historySortByKey = currentOption.historySortByKey;
  }

  const newState = { ...state, ...{ [tableName]: option } };
  return newState;
};

handlers[actions.INIT_SORT] = (state, { payload: { tableName, sortData } }) => ({
  ...state,
  ...{ [tableName]: sortData },
});

export default handleActions(handlers, initialState);
