const initialState: any = {
  data: [],
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

const createClient: any = {
  next(
    state: any = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { clientId, clientSecret, username, permissions, noop },
    }: any
  ): any {
    if (noop) {
      return state;
    }

    const data = {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      ...state.data,
      [clientId]: {
        client_id: clientId,
        client_secret: clientSecret,
        username,
        permissions,
      },
    };

    return { ...state, ...{ data } };
  },
};

const updateClient: any = {
  next(
    state: any = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { clientId, clientSecret, permissions, noop },
    }: any
  ): any {
    if (noop) {
      return state;
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    data[clientId].client_secret = clientSecret;
    data[clientId].permissions = permissions;

    return { ...state, ...{ data } };
  },
};

const deleteClient: any = {
  next(
    state: any = initialState,
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { clientId, noop },
    }: any
  ): any {
    if (noop) {
      return state;
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const data = { ...state.data };

    delete data[clientId];

    return { ...state, ...{ data } };
  },
};

export {
  unSync as UNSYNCCURRENTUSER,
  createClient as CREATECLIENT,
  updateClient as UPDATECLIENT,
  deleteClient as DELETECLIENT,
};
