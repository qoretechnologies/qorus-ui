import { createAction } from 'redux-actions';
import { fetchWithNotifications, post, put, del } from '../../utils';
import settings from '../../../../settings';

const createClient: Function = createAction(
  'CLIENTS_CREATECLIENT',
  async (
    clientId: string,
    clientSecret: string,
    username: string,
    permissions: Array<string>,
    onSuccess: Function,
    dispatch?: Function
  ): Object => {
    if (!dispatch) {
      return {
        clientId,
        clientSecret,
        username,
        permissions,
      };
    }

    await fetchWithNotifications(
      async () => {
        const res = await post(`${settings.OAUTH_URL}/clients`, {
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            username,
            permissions,
          }),
        });

        if (!res.err) {
          onSuccess();
        }

        return res;
      },
      `Creating client ${clientId}...`,
      `Client ${clientId} successfuly created`,
      dispatch
    );

    return {
      noop: true,
    };
  }
);

const updateClient: Function = createAction(
  'CLIENTS_UPDATECLIENT',
  async (
    clientId: string,
    clientSecret: string,
    username: string,
    permissions: Array<string>,
    onSuccess: Function,
    dispatch?: Function
  ): Object => {
    if (!dispatch) {
      return {
        clientId,
        clientSecret,
        permissions,
      };
    }

    await fetchWithNotifications(
      async () => {
        const res = await put(`${settings.OAUTH_URL}/clients/${clientId}`, {
          body: JSON.stringify({
            client_secret: clientSecret,
            username,
            permissions,
          }),
        });

        if (!res.err) {
          onSuccess();
        }

        return res;
      },
      `Updating client ${clientId}...`,
      `Client ${clientId} successfuly updated`,
      dispatch
    );

    return {
      noop: true,
    };
  }
);

const deleteClient: Function = createAction(
  'CLIENTS_DELETECLIENT',
  async (
    clientId: string,
    onSuccess: Function,
    dispatch?: Function
  ): Object => {
    if (!dispatch) {
      return {
        clientId,
      };
    }

    await fetchWithNotifications(
      async () => {
        const res = await del(`${settings.OAUTH_URL}/clients/${clientId}`);

        if (!res.err) {
          onSuccess();
        }

        return res;
      },
      `Deleting client ${clientId}...`,
      `Client ${clientId} successfuly deleted`,
      dispatch
    );

    return {
      noop: true,
    };
  }
);

export { createClient, updateClient, deleteClient };