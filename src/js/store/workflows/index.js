// import actions from './actions';
import { ORDER_STATES } from '../../constants/orders';
import { handleActions } from 'redux-actions';
import { curry, extend } from 'lodash';

let DEFAULTS = {
  TOTAL: 0
};

ORDER_STATES.forEach((val) => { DEFAULTS[val.name] = 0; });

const updateItemWithId = curry((id, props, data) => {
  const idx = data.findIndex((i) => i.id === id);
  const updatedItem = Object.assign({}, data[idx], props);

  return data.slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
});

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
  WORKFLOWS_AUTOSTART: {
    next(state, action) {
      return extend({}, state, {
        data: updateItemWithId(
          action.meta.id,
          { autostart: action.meta.value },
          state.data
        )
      });
    },
    throw(state, action) {
      return {
        ...state,
        sync: false,
        loading: false,
        error: action.payload
      };
    }
  },
  WORKFLOWS_FETCH: {
    next(state, action) {
      return {
        ...state,
        data: transform(action.payload),
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
