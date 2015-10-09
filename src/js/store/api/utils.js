import { curry, extend, merge } from 'lodash';

export const updateItemWithId = curry((id, props, data) => {
  const idx = data.findIndex((i) => i.id === id);
  const updatedItem = Object.assign({}, data[idx], props);

  return data.slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
});


export const extendActions = (name, ...args) => {
  let obj;
  obj = {};
  obj[name] = extend({}, ...args);
  return obj;
};

export function combineResourceActions(res, dActions = {}) {
  let actions;
  actions = res.map((r) => {
    return extendActions(r.name, dActions);
  });

  return merge(...actions);
}
