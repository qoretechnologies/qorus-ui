import { curry } from 'lodash';

export const updateItemWithId = curry((id, props, data) => {
  const idx = data.findIndex((i) => i.id === id);
  const updatedItem = Object.assign({}, data[idx], props);

  return data.slice(0, idx)
    .concat([updatedItem])
    .concat(data.slice(idx + 1));
});
