import ACTIONS from './actions';
import RESOURCES from './resources';
import * as specialReducers from './resources/reducers';
import { updateItemWithId } from './utils';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { omit, assignIn, isArray } from 'lodash';

const initialState = {
  data: [],
  sync: false,
  loading: false,
};

function getResourceByName(resources, name) {
  return resources.find(r => r.name === name);
}

export function createResourceReducers(
  actions,
  resources = [],
  iniState = initialState
) {
  const reducers = {};

  Object.keys(actions).forEach(resource => {
    const resourceOrigin = getResourceByName(resources, resource);

    reducers[resource] = {};
    const handlers = {};

    Object.keys(actions[resource]).forEach(actn => {
      const name = `${resource}_${actn}`.toUpperCase();
      const isSpecialReducer = (specialReducers[resource] &&
          specialReducers[resource][actn.toUpperCase()]);

      handlers[name] = {
        next(state, action) {
          let data;

          if (resourceOrigin && resourceOrigin.transform) {
            data = (isArray(action.payload)) ?
              action.payload.map(resourceOrigin.transform) :
              resourceOrigin.transform(action.payload);
          } else {
            data = action.payload;
          }

          if (isSpecialReducer) {
            return (
              specialReducers[resource][actn.toUpperCase()]
                .next(state, { ...action, payload: data })
            );
          }

          if (action.meta && action.meta.id) {
            data = omit(JSON.parse(action.meta.params.body), 'action');
            return assignIn({}, state, {
              data: updateItemWithId(
                action.meta.id,
                data,
                state.data
              ),
            });
          }

          return {
            ...state,
            data,
            sync: true,
            loading: false,
          };
        },
        throw(state, action) {
          if (isSpecialReducer &&
              specialReducers[resource][actn.toUpperCase()].throw) {
            return (
              specialReducers[resource][actn.toUpperCase()]
                .throw(state, action)
            );
          }

          return {
            ...state,
            sync: false,
            loading: false,
            error: action.payload,
          };
        },
      };
    });

    reducers[resource] = handleActions(
      handlers,
      Object.assign({}, iniState, resourceOrigin.initialState)
    );
  });

  return reducers;
}


export default combineReducers(createResourceReducers(ACTIONS, RESOURCES));
