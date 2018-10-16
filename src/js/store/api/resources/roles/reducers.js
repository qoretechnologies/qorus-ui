import remove from 'lodash/remove';
import { updateItemWithId } from '../../utils';

const initialState: Object = {
  data: [],
  loading: false,
  sync: false,
};

const create: Object = {
  next(state: Object = initialState, action: Object): Object {
    if (action.payload) {
      const data: Array<Object> = state.data.slice();
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
  throw(state: Object = initialState): Object {
    return state;
  },
};

const removeRole: Object = {
  next(state: Object = initialState, action: Object): Object {
    if (action.payload) {
      const data: Array<Object> = state.data.slice();

      remove(data, r => r.role === action.payload.role);

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
    if (action.payload) {
      const { role, desc, perms, groups } = action.payload;
      let data: Array<Object> = state.data.slice();

      data = updateItemWithId(
        role,
        { desc, permissions: perms, groups },
        data,
        'role'
      );

      return Object.assign({}, state, { data });
    }
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const unSyncRoles: Object = {
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
  unSyncRoles as UNSYNCROLES,
};
