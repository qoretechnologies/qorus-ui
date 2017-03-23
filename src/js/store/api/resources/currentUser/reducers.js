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

const updateStorage: Object = {
  next(state: Object = initialState, { payload: { storage } }: Object): Object {
    const data: Object = { ...state.data, ...{ storage } };

    return { ...state, ...{ data } };
  },
};


export {
  unSync as UNSYNCCURRENTUSER,
  updateStorage as UPDATESTORAGE,
};
