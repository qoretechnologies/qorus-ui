import remove from 'lodash/remove';
import { updateItemWithId } from '../../utils';

const initialState: any = {
  data: [],
  loading: false,
  sync: false,
};

const create: any = {
  next(state: any = initialState, action: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      const { role, desc, perms, groups } = action.payload;

      data.push({
        role,
        desc,
        permissions: perms,
        groups,
        provider: 'db',
      });

      return Object.assign({}, state, { data });
    }
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const removeRole: any = {
  next(state: any = initialState, action: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();

      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      remove(data, (r) => r.role === action.payload.role);

      return Object.assign({}, state, { data });
    }
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const update: any = {
  next(state: any = initialState, action: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      const { role, desc, perms, groups } = action.payload;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      let data: Array<Object> = state.data.slice();

      data = updateItemWithId(role, { desc, permissions: perms, groups }, data, 'role');

      return Object.assign({}, state, { data });
    }
    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const unSyncRoles: any = {
  next(state: any = initialState): any {
    return Object.assign({}, state, initialState);
  },
  throw(state: any = initialState): any {
    return state;
  },
};

export { create as CREATE, removeRole as REMOVE, update as UPDATE, unSyncRoles as UNSYNCROLES };
