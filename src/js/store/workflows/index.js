// import actions from './actions';
import { ORDER_STATES } from '../../constants/orders';
import { handleActions } from 'redux-actions';

let DEFAULTS = {
  TOTAL: 0
};

ORDER_STATES.forEach((val) => { DEFAULTS[val.name] = 0; });

const initialState = {
  workflows: {
    data: [],
    sync: false,
    loading: false
  }
};

const transform = (data) => {
  if (!data) return [];

  const resp = data.map((item) => {
    if (!item.id) {
      item.id = item.workflowid;
      delete item.workflowid;
    }
    return Object.assign({}, DEFAULTS, item);
  });
  return resp;
};


export default handleActions({
  WORKFLOWS_AUTOSTART: {
    next(state, action) {
      return state;
    },
    throw(state, action) {
      return {
        ...state,
        workflows: {
          ...state.workflows,
          sync: false,
          loading: false,
          error: action.payload
        }
      };
    }
  },
  WORKFLOWS_FETCH: {
    next(state, action) {
      return {
        ...state,
        workflows: {
          ...state.workflows,
          data: transform(action.payload),
          sync: true,
          loading: false
        }
      };
    },
    throw(state, action) {
      return {
        ...state,
        workflows: {
          ...state.workflows,
          sync: false,
          loading: false,
          error: action.payload
        }
      };
    }
  }
}, initialState);
