import { handleActions } from 'redux-actions';

const initialState = {
  sortBy: 'name',
  sortByKey: 1,
  historySortBy: 'version',
  historySortByKey: -1,
};

export default handleActions({
  CHANGE_WORKFLOWS_SORT: {
    next(state, action) {
      return Object.assign({}, state, action.payload);
    },
    throw(state, action) {
    },
  },
}, initialState);
