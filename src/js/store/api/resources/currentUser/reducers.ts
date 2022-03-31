const initialState: any = {
  data: {},
  loading: false,
  sync: false,
};

const unSync: any = {
  next(state: any = initialState): any {
    return Object.assign({}, state, initialState);
  },
  throw(state: any = initialState): any {
    return state;
  },
};

const updateStorage: any = {
  // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
  next(state: any = initialState, { payload: { storage } }: any): any {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data: any = { ...state.data, ...{ storage } };

    return { ...state, ...{ data } };
  },
};

export { unSync as UNSYNCCURRENTUSER, updateStorage as UPDATESTORAGE };
