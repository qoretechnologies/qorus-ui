import { handleActions } from 'redux-actions';

const initialState = {
  sortBy: 'id',
  sortByKey: 1,
  historySortBy: 'exec_count',
  historySortByKey: -1,
};

export default handleActions({
  CHANGE_SERVICES_SORT: {
    next(state, action) {
      return Object.assign({}, state, action.payload);
    },
    throw(state, action) {
    },
  },
}, initialState);
