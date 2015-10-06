import ACTIONS from './actions';
import RESOURCES from './resources';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';

let REDUCERS;

REDUCERS = {};

const initialState = {
  data: [],
  sync: false,
  loading: false
};

RESOURCES.forEach(resource => {
  let HANDLERS;
  const rName = resource.name;

  HANDLERS = {};

  REDUCERS[rName] = REDUCERS[rName] || {};

  Object.keys(ACTIONS[rName]).forEach((actn) => {
    const handler = `${rName}_${actn}`.toUpperCase();
    HANDLERS[handler] = {
      next(state, action) {
        return {
          ...state,
          data: resource.transform(action.payload),
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
    };
  });

  REDUCERS[rName] = handleActions(HANDLERS, initialState);
});

export default combineReducers(REDUCERS);
