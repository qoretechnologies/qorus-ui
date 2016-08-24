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

const createUserOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const data: Array<Object> = state.data.slice();
    const { username, name, pass, roles } = action.payload;

    data.push({
      username,
      name,
      pass,
      roles,
    });

    return Object.assign({}, state, { data });
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const removeUserOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const data: Array<Object> = state.data.slice();

    remove(data, user => user.username === action.payload.username);

    return Object.assign({}, state, { data });
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

const updateUserOptimistic: Object = {
  next(state: Object = initialState, action: Object): Object {
    const { username, name, roles } = action.payload;
    const data: Array<Object> = state.data.slice();
    const match: Object = data.find(user => user.username === username);

    Object.assign(match, {
      name,
      roles,
    });

    return Object.assign({}, state, { data });
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

const createUser: Object = defaultReducer;
const updateUser: Object = defaultReducer;
const removeUser: Object = defaultReducer;

export {
  createUser as CREATEUSER,
  createUserOptimistic as CREATEUSEROPTIMISTIC,
  removeUser as REMOVEUSER,
  removeUserOptimistic as REMOVEUSEROPTIMISTIC,
  updateUser as UPDATEUSER,
  updateUserOptimistic as UPDATEUSEROPTIMISTIC,
  unSyncUsers as UNSYNCUSERS,
};
