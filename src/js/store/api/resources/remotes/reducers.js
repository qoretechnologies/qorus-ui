const initialState = {
  data: [],
  loading: false,
  sync: false,
};

const pingRemote = {
  next(state: Object = initialState): Object {
    return state;
  },
  throw(state: Object = initialState): Object {
    return state;
  },
};

export {
  pingRemote as PINGREMOTE,
};
