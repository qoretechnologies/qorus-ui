import { handleActions } from 'redux-actions';
import { curry, extend } from 'lodash';

const initialState = {
  data: [],
  sync: false,
  loading: false
};


export default handleActions({
  SYSTEM_FETCH: {
    next(state, action) {
      return {
        ...state,
        data: action.payload,
        sync: true,
        loading: false,
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
