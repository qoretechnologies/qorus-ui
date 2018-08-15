import ACTIONS from './actions';
import RESOURCES from './resources';
import * as specialReducers from './resources/reducers';
import { updateItemWithId, updateItemWithName } from './utils';
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { omit, assignIn, isArray, includes } from 'lodash';

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
      const isSpecialReducer =
        specialReducers[resource] &&
        specialReducers[resource][actn.toUpperCase()];

      handlers[name] = {
        next(state, action) {
          let data;

          if (action.payload) {
            if (resourceOrigin && resourceOrigin.transform) {
              data = isArray(action.payload)
                ? action.payload.map(resourceOrigin.transform)
                : resourceOrigin.transform(action.payload);
            } else {
              data = action.payload;
            }
          }

          if (isSpecialReducer) {
            return specialReducers[resource][actn.toUpperCase()].next(state, {
              ...action,
              payload: data,
            });
          }

          if (action.meta) {
            if (action.meta.id) {
              if (action.meta.params.body) {
                data = omit(JSON.parse(action.meta.params.body), 'action');
              }

              if (action.meta.params.update) {
                data = Object.assign({}, data, action.meta.params.update);
              }

              if (typeof action.meta.id === 'string') {
                return assignIn({}, state, {
                  data: updateItemWithName(action.meta.id, data, state.data),
                  sync: true,
                });
              }

              return assignIn({}, state, {
                data: updateItemWithId(action.meta.id, data, state.data),
                sync: true,
              });
            }

            if (action.meta.ids) {
              const newState = {};
              const stateData = state.data.slice();
              const params = action.meta.params;
              const ids = action.meta.ids.split(',');

              newState.data = stateData.map(w => {
                let key = 'id';

                /**
                 * Groups have to be modified based on name
                 * due to server implementation
                 */
                if (name === 'GROUPS_BATCH_ACTION') {
                  key = 'name';
                }

                if (includes(ids, w[key].toString())) {
                  return Object.assign({}, w, params);
                }

                return w;
              });

              return Object.assign({}, state, newState);
            }

            if (action.meta.params && action.meta.params.fetchMore) {
              data = state.data.slice().concat(data);
            }

            if (
              action.meta.params &&
              action.meta.params.update &&
              action.meta.params.update.data
            ) {
              data = Object.assign(data, action.meta.params.update.data);
            }
          }

          data = data || [];

          console.log('SUCC');

          return {
            ...state,
            data,
            sync: true,
            loading: false,
          };
        },
        throw(state, action) {
          if (
            isSpecialReducer &&
            specialReducers[resource][actn.toUpperCase()].throw
          ) {
            return specialReducers[resource][actn.toUpperCase()].throw(
              state,
              action
            );
          }

          console.log('FAIL');

          return {
            ...state,
            sync: false,
            loading: false,
            error: action.payload,
          };
        },
      };
    });

    let initState = iniState;

    if (resource === 'errors') {
      initState = {
        global: {
          data: [],
          loading: false,
          sync: false,
        },
        workflow: {
          data: [],
          loading: false,
          sync: false,
        },
      };
    } else if (resource === 'orders' || resource === 'orderErrors') {
      initState = {
        data: [],
        sync: false,
        loading: false,
        offset: 0,
        limit: 50,
        sort: 'started',
        sortDir: true,
      };
    } else if (resource === 'releases') {
      initState = {
        data: [],
        sync: false,
        loading: false,
        offset: 0,
        limit: 50,
        sort: 'Name',
        sortDir: 'Descending',
      };
    } else if (resource === 'slaevents') {
      initState = {
        data: [],
        sync: false,
        loading: false,
        offset: 0,
        limit: 50,
        sort: 'sla_eventid',
        sortDir: true,
      };
    }

    const inState = Object.assign({}, initState, resourceOrigin.initialState);

    reducers[resource] = handleActions(handlers, inState);
  });

  return reducers;
}

export default combineReducers(createResourceReducers(ACTIONS, RESOURCES));
