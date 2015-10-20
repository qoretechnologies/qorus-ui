import { isFunction, curry, merge } from 'lodash';
import { createAction } from 'redux-actions';

export const updateItemWithId = curry((id, props, data) => {
  const idx = data.findIndex((i) => i.id === id);
  const updatedItem = Object.assign({}, data[idx], props);

  return data.slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
});

export function combineResourceActions(...actions) {
  return merge(...actions);
}

export function prepareApiActions(url, actions) {
  let actionsHash;
  actionsHash = {};

  Object.keys(actions).forEach(a => {
    let actionFn;
    let metaCreator = null;
    const name = a.toLowerCase();

    if (isFunction(actions[a])) {
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
    const actions = isFunction(defaultActions)
      ? defaultActions(r.actions || []) : defaultActions;

    rr = {};
    rr[name] = prepareApiActions(r.url, actions);
    return rr;
  });

  return merge(...resp);
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
