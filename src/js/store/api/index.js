import ACTIONS from './actions';
import RESOURCES from './resources';
import { updateItemWithId } from './utils';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { omit, extend } from 'lodash';

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
        if (action.meta && action.meta.id) {
          const data = omit(JSON.parse(action.meta.params.body), 'action');
          return extend({}, state, {
            data: updateItemWithId(
              action.meta.id,
              data,
              state.data
            )
          });
        }

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
