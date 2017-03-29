import 'isomorphic-fetch';
import _ from 'lodash';
import { createAction } from 'redux-actions';
import { browserHistory } from 'react-router';


import settings from '../../settings';


export function updateItemWithId(id, props, data, idkey = 'id') {
  const parsedId = parseFloat(id, 10) || id;
  const idx = data.findIndex(i => i[idkey] === parsedId);
  const updatedItem = Object.assign({}, data[idx], props);

  return data.slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
}

export function updateItemWithName(name, props, data, nameKey = 'name') {
  const idx = data.findIndex(i => i[nameKey] === name);
  const updatedItem = Object.assign({}, data[idx], props);

  return data.slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
}

export function combineResourceActions(...actions) {
  return _.merge(...actions);
}

export function setUpdatedToNull(collection) {
  return collection.reduce((newArray, workflow) => (
    [...newArray, { ...workflow, ...{ _updated: null } }]
  ), []);
}

export function prepareApiActions(url, actions) {
  const actionsHash = {};

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
      meta: metaCreator,
    };
  });

  return actionsHash;
}


export function createResourceActions(res, defaultActions = id => id) {
  const resp = res.map(r => {
    const actions = _.isFunction(defaultActions) ?
      defaultActions(r.actions || []) :
      defaultActions;

    return {
      [r.name]: prepareApiActions(r.url, actions),
    };
  });

  return _.merge(...resp);
}


export function createApiActions(actions) {
  const apiActions = {};

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
 * getHeaders - add Qorus-Token header to default headers
 * if token set in localStorage
 *
 * @return {*}  headers for request
 */
function getRestHeaders() {
  let headers = settings.DEFAULT_REST_HEADERS;

  const token = window.localStorage.getItem('token');

  if (token) {
    headers = Object.assign(
      {},
      headers,
      {
        'Qorus-Token': token,
      }
    );
  }
  return headers;
}

/**
 * Checks that server return not 401 and finished without error
 * @param {Object} res
 * @param {string} currentPath
 */
function checkResponse(res, currentPath) {
  const pathname = window.location.pathname;
  if (res.status === 401 && currentPath === pathname) {
    window.localStorage.removeItem('token');
    browserHistory.push(`/login?next=${pathname}`);
  }

  if (
    res.status === 409 ||
    res.status === 400 ||
    res.status === 405 ||
    res.status >= 500 && res.status < 600
  ) {
    const error = new Error();
    error.res = res;
    throw error;
  }
}

/**
 * Fetches data by requesting given URL via given method.
 * If dispatch method does not passsed then print warning that
 * ajax errors couldn't been handled as required.
 * If response.status === 401 then remove localStorage.token and
 * go to /login page
 *
 * @param {string} method method can be also specified in opts
 * @param {string} url
 * @param {RequestInit=} opts
 * @return {Object}
 * @see {@link https://fetch.spec.whatwg.org/|Fetch Standard}
 */
export async function fetchData(method, url, opts, dontCheck) {
  const currentPath = window.location.pathname;
  const res = await fetch(
    url,
    Object.assign({
      method,
      headers: getRestHeaders(),
    }, opts)
  );

  if (!dontCheck) {
    checkResponse(res, currentPath);
  }

  return res;
}

export async function fetchJson(method, url, opts = {}, dontCheck) {
  const res = await fetchData(method, url, opts, dontCheck);
  return res.json();
}

export async function fetchText(method, url, opts, dontCheck) {
  const res = await fetchData(method, url, opts, dontCheck);
  return res.text();
}
