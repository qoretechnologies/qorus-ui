import remove from 'lodash/remove';

const initialState: Object = {
  data: [],
  loading: false,
  sync: false,
};

const defaultReducer = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const createRoleOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
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
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const removeRoleOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const data: Array<Object> = state.data.slice();

    remove(data, r => r.role === action.payload.role);

    return Object.assign({}, state, { data });
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const updateRoleOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const { role, desc, perms, groups } = action.payload;
    const data: Array<Object> = state.data.slice();
    const match: Object = data.find(r => r.role === role);

    Object.assign(match, {
      desc,
      permissions: perms,
      groups,
    });

    return Object.assign({}, state, { data });
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const createRole: Object = defaultReducer;
const updateRole: Object = defaultReducer;
const removeRole: Object = defaultReducer;

const unSyncRoles: Object = {
  next(state: Object = initialState): Object {
    return Object.assign({}, state, initialState);
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

export {
  createRole as CREATEROLE,
  createRoleOptimistic as CREATEROLEOPTIMISTIC,
  removeRole as REMOVEROLE,
  removeRoleOptimistic as REMOVEROLEOPTIMISTIC,
  updateRole as UPDATEROLE,
  updateRoleOptimistic as UPDATEROLEOPTIMISTIC,
  unSyncRoles as UNSYNCROLES,
};
