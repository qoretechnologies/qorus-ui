import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import { del, fetchWithNotifications, post, put } from '../../utils';

const createClient: Function = createAction(
  'CLIENTS_CREATECLIENT',
  async (
    clientId: string,
    clientDescription: string,
    clientSecret: string,
    username: string,
    permissions: Array<string>,
    onSuccess: Function,
    dispatch?: Function
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): any => {
    if (!dispatch) {
      return {
        noop: true,
      };
    }

    const {
      inserted: { client_id, client_secret, ...rest },
    } = await fetchWithNotifications(
      async () => {
        const res = await post(`${settings.OAUTH_URL}/clients`, {
          body: JSON.stringify({
            client_description: clientDescription,
            client_secret: clientSecret,
            username,
            permissions,
          }),
        });

        if (!res.err) {
          onSuccess(res);
        }

        return res;
      },
      `Creating client...`,
      `Client successfuly created`,
      dispatch
    );

    return {
      clientId: client_id,
      clientSecret: client_secret,
      clientDescription: rest.client_description,
      ...rest,
    };
  }
);

const updateClient: Function = createAction(
  'CLIENTS_UPDATECLIENT',
  async (
    clientId: string,
    clientDescription: string,
    clientSecret: string,
    username: string,
    permissions: Array<string>,
    onSuccess: Function,
    dispatch?: Function
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): any => {
    if (!dispatch) {
      return {
        clientId,
        clientDescription,
        clientSecret,
        permissions,
      };
    }

    const {
      updated: { client_id, client_secret, ...rest },
    } = await fetchWithNotifications(
      async () => {
        const res = await put(`${settings.OAUTH_URL}/clients/${clientId}`, {
          body: JSON.stringify({
            client_secret: clientSecret,
            client_description: clientDescription,
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
      clientId: client_id,
      clientSecret: client_secret,
      clientDescription: rest.client_description,
      ...rest,
    };
  }
);

const deleteClient: Function = createAction(
  'CLIENTS_DELETECLIENT',
  async (
    clientId: string,
    onSuccess: Function,
    dispatch?: Function
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): any => {
    if (!dispatch) {
      return {
        clientId,
      };
    }

    await fetchWithNotifications(
      async () => {
        const res = await del(`${settings.OAUTH_URL}/clients/${clientId}`);

        if (!res.err) {
          onSuccess?.();
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
