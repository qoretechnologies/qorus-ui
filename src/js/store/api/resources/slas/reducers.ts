import remove from 'lodash/remove';
import { updateItemWithName } from '../../utils';

const removeSla = {
  next(
    state: any = {},
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { id },
    }: any
  ): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = [...state.data];

    // @ts-ignore ts-migrate(2339) FIXME: Property 'slaid' does not exist on type 'Object'.
    remove(data, (sla: any): boolean => sla.slaid === id);

    return { ...state, ...{ data } };
  },
};

const createSla = {
  next(
    state: any = {},
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { slaid, name, description, units, error },
    }: any
  ): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    let data = [...state.data];

    if (error) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
      remove(data, (sla: any): boolean => sla.name === name);
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
