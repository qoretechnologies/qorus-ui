import { handleActions } from 'redux-actions';

const initialState = {
  sortBy: 'status',
  sortByKey: { ignoreCase: true, direction: 1 },
  historySortBy: 'name',
  historySortByKey: { ignoreCase: true, direction: 1 },
};

export default handleActions({
  CHANGE_OPTIONS_SORT: {
    next(state, action) {
      const payload = action.payload;

      if (action.payload.sortBy !== state.sortBy) {
        payload.historySortBy = state.sortBy;
        payload.historySortByKey = state.sortByKey;
      } else {
        payload.sortByKey = { ignoreCase: true, direction: state.sortByKey.direction * -1 };
      }

      return Object.assign({}, state, payload);
    },
  },
}, initialState);
