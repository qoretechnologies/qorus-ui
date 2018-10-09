/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';
import { unSyncUsers } from '../users/actions';
import { unSyncCurrentUser } from '../currentUser/actions';
import actions from '../../actions';

const create: Function = createAction(
  'ROLES_CREATE',
  async (
    role: string,
    desc: string,
    perms: Array<string>,
    groups: Array<string>,
    dispatch: Function
  ): ?Object => {
    if (!dispatch) {
      return {
        role,
        desc,
        perms,
        groups,
      };
    }

    await fetchWithNotifications(
      async () =>
        await fetchJson('POST', `${settings.REST_BASE_URL}/roles/`, {
          body: JSON.stringify({
            role,
            desc,
            perms,
            groups,
          }),
        }),
      'Creating role...',
      'Role successfuly created',
      dispatch
    );

    dispatch(unSyncUsers());
    dispatch(unSyncCurrentUser());
    dispatch(actions.currentUser.fetch());
  }
);

const remove: Function = createAction(
  'ROLES_REMOVE',
  async (role: string, dispatch: Function): ?Object => {
    if (!dispatch) {
      return { role };
    }

    await fetchWithNotifications(
      async () =>
        await fetchJson('DELETE', `${settings.REST_BASE_URL}/roles/${role}`),
      'Deleting role...',
      'Role successfuly deleted',
      dispatch
    );

    dispatch(unSyncUsers());
    dispatch(unSyncCurrentUser());
    dispatch(actions.currentUser.fetch());
  }
);

const update: Function = createAction(
  'ROLES_UPDATE',
  async (
    role: string,
    desc: string,
    perms: Array<string>,
    groups: Array<string>,
    dispatch: Function
  ): ?Object => {
    if (!dispatch) {
      return {
        desc,
        role,
        perms,
        groups,
      };
    }

    await fetchWithNotifications(
      async () =>
        await fetchJson('PUT', `${settings.REST_BASE_URL}/roles/${role}`, {
          body: JSON.stringify({
            desc,
            role,
            perms,
            groups,
          }),
        }),

      'Updating role...',
      'Role successfuly updated',
      dispatch
    );

    dispatch(unSyncUsers());
    dispatch(unSyncCurrentUser());
    dispatch(actions.currentUser.fetch());
  }
);

const unSyncRoles: Function = createAction('USERS_UNSYNCROLES');

export { create, remove, update, unSyncRoles };
