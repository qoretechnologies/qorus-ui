import 'whatwg-fetch';
import { createAction } from 'redux-actions';
import RESOURCES from './resources';

let ACTIONS;
let DEFAULT_ACTIONS;

DEFAULT_ACTIONS = {
  FETCH: (url, params) => async () =>  {
    const result = await fetch(url, params);
    return result.json();
  },
  ACTION: (url, params) => async () => {
    const result = await fetch(url, params);
    return result.json();
  },
  UPDATE: (url, params) => async ()  => {
    const result = await fetch(url, params);
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
      DEFAULT_ACTIONS[a](r.url)
    );
  });
});


export default ACTIONS;
