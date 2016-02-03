import { curry, assignIn } from 'lodash';

export const normalizeId = curry((idAttribute, item) => (
  Object.assign({ id: item[idAttribute] }, item)
));

export const extendDefaults = curry((defaults, item) => (
  assignIn({}, defaults, item)
));

export const normalizeName = curry((item) => {
  //  <name> v<version>[.<patch>] (<id>)
  const { name, version, patch, id } = item;
  const normalizedName = patch ?
    `${name} v${version}.${patch} (${id})` :
    `${name} v${version} (${id})`;

  return Object.assign({ normalizedName }, item);
});
