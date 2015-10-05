import ACTIONS from './actions';
import RESOURCES from './resources';
import { handleActions, combineReducers } from 'redux-actions';

let REDUCERS;

REDUCERS = {};

const initialState = {
  data: [],
  sync: false,
  loading: false
};

RESOURCES.forEach(resource => {
  let HANDLERS;

  HANDLERS = {};

  REDUCERS[resource] = REDUCERS[resource] || {};

  ACTIONS[resource].forEach((fn, actn) => {
    HANDLERS[actn] = {
      next(state, action) {
        console.log(state, action);
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

  REDUCERS[resource] = handleActions(HANDLERS, initialState);
});

export default combineReducers(REDUCERS);
