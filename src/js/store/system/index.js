import { handleActions } from 'redux-actions';
import { curry, extend } from 'lodash';

const initialState = {
  data: [],
  sync: false,
  loading: false
};

const transform = (data) => {
  if (!data) return [];

  const resp = data.map((item) => {
    if (!item.id) {
      item.id = item.workflowid;
      delete item.workflowid;
    }
    return extend({}, DEFAULTS, item);
  });
  return resp;
};


export default handleActions({
  SYSTEM_FETCH: {
    next(state, action) {
      return {
        ...state,
        data: action.payload,
        sync: true,
        loading: false
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
