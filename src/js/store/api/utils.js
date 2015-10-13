import { isObject, isFunction, curry, extend, merge } from 'lodash';

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
    let name = a.toLowerCase();

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
  return res.map(r => {
    let rr;
    const name = r.name.toLowerCase();
    const actions = isFunction(defaultActions)
      ? defaultActions(r.actions) : defaultActions;

    rr = {};
    rr[name] = prepareApiActions(r.url, actions);
    return rr;
  });
}
