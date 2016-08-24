const initialState: Object = {
  data: {},
  loading: false,
  sync: false,
};

const unSync: Object = {
  next(state: Object = initialState): Object {
    return Object.assign({}, state, initialState);
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

export {
  unSync as UNSYNCCURRENTUSER,
};
