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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: Object = initialState, { payload: { storage } }: Object): Object {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data: Object = { ...state.data, ...{ storage } };

    return { ...state, ...{ data } };
  },
};

export { unSync as UNSYNCCURRENTUSER, updateStorage as UPDATESTORAGE };
