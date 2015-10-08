import 'whatwg-fetch';
import { createAction } from 'redux-actions';
import RESOURCES from './resources';
import { isFunction } from 'lodash';

let ACTIONS;
let DEFAULT_ACTIONS;

DEFAULT_ACTIONS = {
  FETCH: (url) => async (params) =>  {
    const result = await fetch(url, params);
    return result.json();
  },
  ACTION: {
    action: (url) => async (params, id) => {
      const fetchUrl = (id) ? `${url}/${id}` : url;
      const result = await fetch(fetchUrl, Object.assign({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }, params));
      return result.json();
    },
    meta: (params, id) => { return { params, id }; }
  },
  UPDATE: (url) => async (params, id)  => {
    const fetchUrl = (id) ? `${url}/${id}` : url;
    const result = await fetch(fetchUrl, params);
    return result.json();
  }
};

ACTIONS = {};

RESOURCES.forEach(r => {
  const name = r.name;

  ACTIONS[name] = ACTIONS[name] || {};

  const actions = Object.keys(DEFAULT_ACTIONS);

  actions.forEach(a => {
    let actionFn;
    let metaCreator = null;
    const action = a.toLowerCase();

    if (isFunction(DEFAULT_ACTIONS[a])) {
      actionFn = DEFAULT_ACTIONS[a](r.url);
    } else {
      actionFn = DEFAULT_ACTIONS[a]['action'](r.url);
      metaCreator = DEFAULT_ACTIONS[a]['meta'];
    }

    ACTIONS[name][action] = createAction(
      `${name.toUpperCase()}_${a.toUpperCase()}`,
      actionFn,
      metaCreator
    );
  });
});

// export function combineApiActions(...actions) {
//   actions.forEach()
// }

export default ACTIONS;
