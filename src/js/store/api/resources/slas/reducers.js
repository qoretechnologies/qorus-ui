import remove from 'lodash/remove';

import { updateItemWithName } from '../../utils';

const removeSla = {
  next(
    state: Object = {},
    {
      payload: { id },
    }: Object
  ): Object {
    const data = [...state.data];

    remove(data, (sla: Object): boolean => sla.slaid === id);

    return { ...state, ...{ data } };
  },
};

const createSla = {
  next(
    state: Object = {},
    {
      payload: { slaid, name, description, units, error },
    }: Object
  ): Object {
    let data = [...state.data];

    if (error) {
      remove(data, (sla: Object): boolean => sla.name === name);
    } else if (!slaid) {
      data = [...data, { name, description, units, slaid: '?' }];
    } else {
      data = updateItemWithName(name, { slaid }, data, 'name');
    }

    return { ...state, ...{ data } };
  },
};

const unsync = {
  next() {
    return {
      data: [],
      loading: false,
      sync: false,
    };
  },
};

export { removeSla as REMOVE, createSla as CREATE, unsync as UNSYNC };
