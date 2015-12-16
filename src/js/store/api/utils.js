import _ from 'lodash';
import { createAction } from 'redux-actions';
import 'whatwg-fetch';


import settings from '../../settings';


export function updateItemWithId(id, props, data) {
  const idx = data.findIndex(i => i.id === id);
  const updatedItem = Object.assign({}, data[idx], props);

  return data.slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
}


export function combineResourceActions(...actions) {
  return _.merge(...actions);
}


export function prepareApiActions(url, actions) {
  let actionsHash;
  actionsHash = {};

  Object.keys(actions).forEach(a => {
    let actionFn;
    let metaCreator = null;
    const name = a.toLowerCase();

    if (_.isFunction(actions[a])) {
      actionFn = actions[a];
    } else {
      actionFn = actions[a].action;
      metaCreator = actions[a].meta;
    }

    actionsHash[name] = {
      action: actionFn(url),
      meta: metaCreator
    };
  });

  return actionsHash;
}


export function createResourceActions(res, defaultActions = id => id) {
  const resp = res.map(r => {
    let rr;
    const name = r.name;
    const actions = _.isFunction(defaultActions)
      ? defaultActions(r.actions || []) : defaultActions;

    rr = {};
    rr[name] = prepareApiActions(r.url, actions);
    return rr;
  });

  return _.merge(...resp);
}


export function createApiActions(actions) {
  let apiActions;

  apiActions = {};

  Object.keys(actions).forEach(key => {
    apiActions[key] = {};

    Object.keys(actions[key]).forEach(action => {
      apiActions[key][action] = createAction(
        `${key}_${action}`.toUpperCase(),
        actions[key][action].action,
        actions[key][action].meta
      );
    });
  });

  return apiActions;
}


/**
 * Fetches JSON data by requesting given URL via given method.
 *
 * @param {string} method method can be also specified in opts
 * @param {string} url
 * @param {RequestInit=} opts
 * @return {JSON}
 * @see {@link https://fetch.spec.whatwg.org/|Fetch Standard}
 */
export async function fetchJson(method, url, opts = {}) {
  const res = await fetch(
    url,
    Object.assign({
      method,
      headers: settings.DEFAULT_REST_HEADERS
    }, opts)
  );

  return res.json();
}
