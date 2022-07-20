import remove from 'lodash/remove';

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
      const { username, name, pass, roles } = action.payload;

      data.push({
        username,
        name,
        pass,
        roles,
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
      remove(data, (user) => user.username === action.payload.username);

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
      const { username, name, roles } = action.payload;
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();
      // @ts-ignore ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message
      const match: any = data.find((user) => user.username === username);

      Object.assign(match, {
        name,
        roles,
      });

      return Object.assign({}, state, { data });
    }

    return state;
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const unSyncUsers: any = {
  next(state: any = initialState): any {
    return Object.assign({}, state, initialState);
  },
  throw(state: any = initialState): any {
    return state;
  },
};

export { create as CREATE, removeRole as REMOVE, update as UPDATE, unSyncUsers as UNSYNCUSERS };
