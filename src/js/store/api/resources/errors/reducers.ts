/* @flow */
import remove from 'lodash/remove';
import { updateItemWithName } from '../../utils';

const initialState: any = {
  global: {
    data: [],
    loading: false,
    sync: false,
  },
  workflow: {
    data: [],
    loading: false,
    sync: false,
  },
};

const fetch: any = {
  next(
    state: any = initialState,
    { payload: { errors, type } }: { payload: { errors: any; type: string } }
  ) {
    return {
      ...state,
      ...{ [type]: { data: errors, sync: true, loading: false } },
    };
  },
};

const createOrUpdate: any = {
  next(
    state: any = initialState,
    { payload: { id, data, type } }: { payload: { id: number; data: any; type: string } }
  ) {
    if (data) {
      const exists = state[type].data.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
        (obj: any): boolean => obj.error === data.error
      );
      let newData;

      if (exists) {
        const stateData = [...state[type].data];

        newData = updateItemWithName(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
          data.error,
          { ...data },
          stateData,
          'error'
        );
      } else {
        const dataObj =
          // @ts-ignore ts-migrate(2367) FIXME: This condition will always return 'true' since the... Remove this comment to see the full error message
          id && id !== 'omit' ? { ...data, ...{ workflowid: id } } : data;

        newData = [...state[type].data, dataObj];
      }

      return { ...state, ...{ [type]: { ...state[type], data: newData } } };
    }

    return state;
  },
};

const removeError: any = {
  next(
    state: any = initialState,
    { payload: { name, type } }: { payload: { name: string; type: string } }
  ) {
    if (name) {
      const data = [...state[type].data];

      // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
      remove(data, (error: any) => error.error === name);

      return { ...state, ...{ [type]: { ...state[type], data } } };
    }

    return state;
  },
};

const unsync: any = {
  next() {
    return { ...initialState };
  },
};

export {
  fetch as FETCH,
  createOrUpdate as CREATEORUPDATE,
  removeError as REMOVE,
  unsync as UNSYNC,
};
