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
      const payload = action.payload;

      if (action.payload.sortBy !== state.sortBy) {
        payload.historySortBy = state.sortBy;
        payload.historySortByKey = state.sortByKey;
      } else {
        payload.sortByKey = state.sortByKey * -1;
      }

      return Object.assign({}, state, payload);
    },
  },
}, initialState);
