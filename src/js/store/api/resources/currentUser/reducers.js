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

const storeSortChange: Object = {
  next(state: Object = initialState, { payload: { table, sort } }: Object): Object {
    const data: Object = { ...state.data };

    if (!data.storage[table]) {
      data.storage[table] = {};
    }

    data.storage[table].sort = sort;

    return { ...state, ...{ data } };
  },
};


export {
  unSync as UNSYNCCURRENTUSER,
  storeSortChange as STORESORTCHANGE,
};
