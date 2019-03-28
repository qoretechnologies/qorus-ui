import { updateItemWithId } from '../../utils';

const initialState: Object = {
  data: [],
  loading: false,
  sync: false,
};

const unSync: Object = {
  next (state: Object = initialState): Object {
    return Object.assign({}, state, initialState);
  },
  throw (state: Object = initialState): Object {
    return state;
  },
};

const createClient: Object = {
  next (
    state: Object = initialState,
    {
      payload: { clientId, clientSecret, username, permissions, noop },
    }: Object
  ): Object {
    if (noop) {
      return state;
    }

    const data = {
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

const updateClient: Object = {
  next (
    state: Object = initialState,
    {
      payload: { clientId, clientSecret, permissions, noop },
    }: Object
  ): Object {
    if (noop) {
      return state;
    }

    const data = { ...state.data };

    data[clientId].client_secret = clientSecret;
    data[clientId].permissions = permissions;

    return { ...state, ...{ data } };
  },
};

const deleteClient: Object = {
  next (
    state: Object = initialState,
    {
      payload: { clientId, noop },
    }: Object
  ): Object {
    if (noop) {
      return state;
    }

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
