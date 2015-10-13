import ACTIONS from './actions';
import RESOURCES from './resources';
import { updateItemWithId } from './utils';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { omit, extend } from 'lodash';

const initialState = {
  data: [],
  sync: false,
  loading: false
};

function getResourceByName(resources, name) {
  return resources.find(r => { return r.name === name; });
}

export function createResourceReducers(
  actions,
  resources = [],
  iniState = initialState
) {

  let reducers;
  reducers = {};

  Object.keys(actions).forEach(resource => {
    reducers[resource] = {};
    let handlers;

    handlers = {};

    Object.keys(actions[resource]).forEach(actn => {
      const name = `${resource}_${actn}`.toUpperCase();

      handlers[name] = {
        next(state, action) {
          let data;

          if (action.meta && action.meta.id) {
            data = omit(JSON.parse(action.meta.params.body), 'action');
            return extend({}, state, {
              data: updateItemWithId(
                action.meta.id,
                data,
                state.data
              )
            });
          }

          const resourceOrigin = getResourceByName(resources, resource);

          data = (resourceOrigin && resourceOrigin.transform) ?
            resourceOrigin.transform(action.payload) : action.payload;

          return {
            ...state,
            data: data,
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

    reducers[resource] = handleActions(handlers, iniState);
  });

  return reducers;
}

export default combineReducers(createResourceReducers(ACTIONS, RESOURCES));
