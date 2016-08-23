import remove from 'lodash/remove';
import RBAC from '../../../../constants/rbac';

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

const createPermOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const data: Array<Object> = state.data.slice();
    const { name, desc } = action.payload;

    data.push({
      name,
      desc,
      permission_type: RBAC.PERMS_TYPE,
    });

    return Object.assign({}, state, { data });
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const createPerm: Object = defaultReducer;

const removeOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const data: Array<Object> = state.data.slice();

    remove(data, p => p.name === action.payload.name);

    return Object.assign({}, state, { data });
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const removePerm: Object = defaultReducer;

const updateOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const { name, desc } = action.payload;
    const data: Array<Object> = state.data.slice();
    const match: Object = data.find(p => p.name === name);

    Object.assign(match, {
      desc,
      permission_type: RBAC.PERMS_TYPE,
    });

    return Object.assign({}, state, { data });
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const updatePerm: Object = defaultReducer;

export {
  createPerm as CREATEPERM,
  createPermOptimistic as CREATEPERMOPTIMISTIC,
  removeOptimistic as REMOVEPERMOPTIMISTIC,
  removePerm as REMOVEPERM,
  updatePerm as UPDATEPERM,
  updateOptimistic as UPDATEPERMOPTIMISTIC,
};
