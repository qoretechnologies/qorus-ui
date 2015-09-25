import { handleActions } from 'redux-actions';

const initialState = {
  data: [],
  sync: false,
  loading: false
};

export default handleActions({
  CURRENT_USER_FETCH: {
    next(state, action) {
      return {
        data: action.payload,
        loading: false,
        sync: true,
        error: null
      };
    },
    throw(state, action) {
      return {
        ...state,
        sync: false,
        loading: false,
        error: action.payload
      };
    }
  }
}, initialState);
