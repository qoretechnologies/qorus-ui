import _ from 'lodash';
import omit from 'lodash/omit';
import { browserHistory } from 'react-router';
import { createAction } from 'redux-actions';
import shortid from 'shortid';
import settings from '../../settings';
import { warning } from '../ui/bubbles/actions';
import { processRESTResponse } from './resources/utils';

export const updateItemWithId: Function = (
  id: string | number,
  props: any,
  data: Array<Object>,
  idkey: string = 'id'
) =>
  data.reduce((newData: Array<Object>, datum: any): Array<Object> => {
    // eslint-disable-next-line
    if (datum[idkey] == id) {
      return [...newData, { ...datum, ...props }];
    }

    return [...newData, datum];
  }, []);

export function updateItemWithName(name, props, data, nameKey = 'name') {
  const idx = data.findIndex((i) => i[nameKey] === name);
  const updatedItem = Object.assign({}, data[idx], props);

  return data
    .slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
}

export function combineResourceActions(...actions) {
  return _.merge(...actions);
}

export function setUpdatedToNull(collection) {
  return collection.reduce(
    (newArray, workflow) => [...newArray, { ...workflow, ...{ _updated: null } }],
    []
  );
}

export function prepareApiActions(url, actions) {
  const actionsHash = {};

  Object.keys(actions).forEach((a) => {
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

export function createResourceActions(res, defaultActions = (id) => id) {
  const resp = res.map((r) => {
    const actions = _.isFunction(defaultActions) ? defaultActions(r.actions || []) : defaultActions;

    return {
      [r.name]: prepareApiActions(r.url, actions),
    };
  });

  return _.merge(...resp);
}

export function createApiActions(actions) {
  const apiActions = {};

  Object.keys(actions).forEach((key) => {
    apiActions[key] = {};

    Object.keys(actions[key]).forEach((action) => {
      apiActions[key][action] = createAction(
        `${key}_${action}`.toUpperCase(),
        actions[key][action].action,
        actions[key][action].meta
      );
    });
  });

  return apiActions;
}

export function getToken() {
  return (
    document.cookie
      ?.split('; ')
      .find((row) => row.startsWith('Qorus-Auth-Context='))
      ?.split('=')[1] || window.localStorage.getItem('token')
  );
}

/**
 * getHeaders - add Qorus-Token header to default headers
 * if token set in localStorage
 *
 * @return {*}  headers for request
 */
function getRestHeaders(yaml) {
  let headers = yaml ? settings.YAML_REST_HEADERS : settings.DEFAULT_REST_HEADERS;

  const token = getToken();

  if (token) {
    headers = Object.assign({}, headers, {
      'Qorus-Token': token,
    });
  }
  return headers;
}

/**
 * Checks that server return not 401 and finished without error
 * @param {Object} res
 * @param {string} currentPath
 */
function checkResponse(res, currentPath, redirectOnError = true, notificationId) {
  const pathname = window.location.pathname + encodeURIComponent(window.location.search);
  if (res.status === 401 && currentPath === window.location.pathname) {
    window.localStorage.removeItem('token');
    browserHistory.push(`/login?next=${pathname}`);
  }

  if (res.status === 500) {
    if (!redirectOnError) return;

    browserHistory.push(`/error?next=${pathname}`);
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
export async function fetchData(method, url, opts, dontCheck, redirectOnError, yaml) {
  const currentPath = window.location.pathname;
  const fetchOpts: any = omit(opts, ['notificationId']);
  // @ts-ignore ts-migrate(2339) FIXME: Property 'headers' does not exist on type 'Object'... Remove this comment to see the full error message
  const { headers } = fetchOpts;

  const res = await fetch(
    url,
    Object.assign(fetchOpts, {
      method,
      headers: {
        ...getRestHeaders(yaml),
        ...headers,
      },
    })
  );

  if (!dontCheck) {
    checkResponse(res, currentPath, redirectOnError, opts && opts.notificationId);
  }

  return res;
}

export async function fetchJson(method, url, opts = {}, dontCheck, redirectOnError) {
  // @ts-ignore ts-migrate(2554) FIXME: Expected 6 arguments, but got 5.
  const res = await fetchData(method, url, opts, dontCheck, redirectOnError);
  let jsonRes;

  try {
    jsonRes = await res.json();
  } catch (e) {
    jsonRes = 'success';
  }

  if (res.status >= 400 && res.status <= 600) {
    const desc: string = jsonRes.desc || jsonRes;

    return {
      err: true,
      desc,
    };
  }

  return jsonRes;
}

export async function put(...args): Promise<any> {
  // @ts-ignore ts-migrate(2556) FIXME: Expected 5 arguments, but got 1 or more.
  return await fetchJson('PUT', ...args);
}

export async function get(...args): Promise<any> {
  // @ts-ignore ts-migrate(2556) FIXME: Expected 5 arguments, but got 1 or more.
  return await fetchJson('GET', ...args);
}

export async function post(...args): Promise<any> {
  // @ts-ignore ts-migrate(2556) FIXME: Expected 5 arguments, but got 1 or more.
  return await fetchJson('POST', ...args);
}

export async function del(...args): Promise<any> {
  // @ts-ignore ts-migrate(2556) FIXME: Expected 5 arguments, but got 1 or more.
  return await fetchJson('DELETE', ...args);
}

export async function fetchYaml(method, url, opts = {}, dontCheck, redirectOnError, yaml) {
  const res = await fetchData(method, url, opts, dontCheck, redirectOnError, yaml);

  return res.text();
}

export async function fetchText(method, url, opts, dontCheck, redirectOnError) {
  // @ts-ignore ts-migrate(2554) FIXME: Expected 6 arguments, but got 5.
  const res = await fetchData(method, url, opts, dontCheck, redirectOnError);
  return res.text();
}

export async function fetchResponse(method, url, opts, dontCheck, redirectOnError) {
  // @ts-ignore ts-migrate(2554) FIXME: Expected 6 arguments, but got 5.
  const res = await fetchData(method, url, opts, dontCheck, redirectOnError);

  return res;
}

export async function fetchWithNotifications(
  fetchFunc: Function,
  notificationBefore: string,
  notificationSuccess: string,
  dispatch
  // @ts-ignore ts-migrate(1055) FIXME: Type 'any' is not a valid async function return ty... Remove this comment to see the full error message
): any {
  if (fetchFunc) {
    const notificationId = shortid.generate();

    if (notificationBefore) {
      dispatch(warning(notificationBefore, notificationId));
    }

    const res: any = await fetchFunc();

    processRESTResponse(res, dispatch, notificationSuccess, notificationId);

    return res;
  }

  return {};
}
