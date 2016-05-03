import { handleActions } from 'redux-actions';

const initialState = {
  sortBy: 'type',
  sortByKey: 1,
  historySortBy: 'name',
  historySortByKey: 1,
};

export default handleActions({
  CHANGE_SERVICES_SORT: {
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
