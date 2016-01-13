import { curry, extend } from 'lodash';

export const normalizeId = curry((idAttribute, item) => {
  return Object.assign({ id: item[idAttribute] }, item);
});

export const extendDefaults = curry((defaults, item) => {
  return extend({}, defaults, item);
});

export const normalizeName = curry((item) => {
  //  <name> v<version>[.<patch>] (<id>)
  const { name, version, patch, id } = item;
  const normalizedName = patch ?
    `${name} v${version}.${patch} (${id})` :
    `${name} v${version} (${id})`;

  return Object.assign({ normalizedName }, item);
});
