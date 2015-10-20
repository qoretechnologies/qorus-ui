import { curry, extend } from 'lodash';

export const normalizeId = curry((idAttribute, item) => {
  if (!item.id) {
    item.id = item[idAttribute];
  }
  return item;
});

export const extendDefaults = curry((defaults, item) => {
  return extend({}, defaults, item);
});

export const normalizeName = curry((item) => {
  //  <name> v<version>[.<patch>] (<id>)
  const { name, version, patch, id } = item;

  if (patch) {
    item.normalizedName = `${name} v${version}.${patch} (${id})`;
  } else {
    item.normalizedName = `${name} v${version} (${id})`;
  }

  return item;
});
