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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { clientId, clientSecret, username, permissions, noop },
    }: Object
  ): Object {
    if (noop) {
      return state;
    }

    const data = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { clientId, clientSecret, permissions, noop },
    }: Object
  ): Object {
    if (noop) {
      return state;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'payload' does not exist on type 'Object'... Remove this comment to see the full error message
      payload: { clientId, noop },
    }: Object
  ): Object {
    if (noop) {
      return state;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
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
