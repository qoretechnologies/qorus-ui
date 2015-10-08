import 'whatwg-fetch';
import { createAction } from 'redux-actions';
import RESOURCES from './resources';

let ACTIONS;
let DEFAULT_ACTIONS;

DEFAULT_ACTIONS = {
  FETCH: (url) => async (params) =>  {
    const result = await fetch(url, params);
    return result.json();
  },
  ACTION: (url) => async (params, id) => {
    const fetchUrl = (id) ? `${url}/${id}` : url;
    const result = await fetch(fetchUrl, Object.assign({
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT'
    }, params));
    return result.json();
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
    const action = a.toLowerCase();
    ACTIONS[name][action] = createAction(
      `${name.toUpperCase()}_${a.toUpperCase()}`,
      DEFAULT_ACTIONS[a](r.url),
      (...args) => { console.log('meta', args); }
    );
  });
});

// export function combineApiActions(...actions) {
//   actions.forEach()
// }


export default ACTIONS;
