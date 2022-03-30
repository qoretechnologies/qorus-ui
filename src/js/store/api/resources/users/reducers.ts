import remove from 'lodash/remove';

const initialState: Object = {
  data: [],
  loading: false,
  sync: false,
};

const create: Object = {
  next(state: Object = initialState, action: Object): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
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
  throw(state: Object = initialState): Object {
    return state;
  },
};

const removeRole: Object = {
  next(state: Object = initialState, action: Object): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      remove(data, user => user.username === action.payload.username);

      return Object.assign({}, state, { data });
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const update: Object = {
  next(state: Object = initialState, action: Object): Object {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
    if (action.payload) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      const { username, name, roles } = action.payload;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      const data: Array<Object> = state.data.slice();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'username' does not exist on type 'Object... Remove this comment to see the full error message
      const match: Object = data.find(user => user.username === username);

      Object.assign(match, {
        name,
        roles,
      });

      return Object.assign({}, state, { data });
    }

    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const unSyncUsers: Object = {
  next(state: Object = initialState): Object {
    return Object.assign({}, state, initialState);
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

export {
  create as CREATE,
  removeRole as REMOVE,
  update as UPDATE,
  unSyncUsers as UNSYNCUSERS,
};
