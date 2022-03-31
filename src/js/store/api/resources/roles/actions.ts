/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import actions from '../../actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import { unSyncCurrentUser } from '../currentUser/actions';
import { unSyncUsers } from '../users/actions';

const create: Function = createAction(
  'ROLES_CREATE',
  async (
    role: string,
    desc: string,
    perms: Array<string>,
    groups: Array<string>,
    dispatch: Function
    // @ts-ignore ts-migrate(1055) FIXME: Type 'Object' is not a valid async function return... Remove this comment to see the full error message
  ): Object => {
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
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    dispatch(actions.currentUser.fetch());
  }
);

const remove: Function = createAction(
  'ROLES_REMOVE',
  // @ts-ignore ts-migrate(1055) FIXME: Type 'Object' is not a valid async function return... Remove this comment to see the full error message
  async (role: string, dispatch: Function): Object => {
    if (!dispatch) {
      return { role };
    }

    await fetchWithNotifications(
      async () =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
        await fetchJson('DELETE', `${settings.REST_BASE_URL}/roles/${role}`),
      'Deleting role...',
      'Role successfuly deleted',
      dispatch
    );

    dispatch(unSyncUsers());
    dispatch(unSyncCurrentUser());
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
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
    // @ts-ignore ts-migrate(1055) FIXME: Type 'Object' is not a valid async function return... Remove this comment to see the full error message
  ): Object => {
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
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    dispatch(actions.currentUser.fetch());
  }
);

const unSyncRoles: Function = createAction('USERS_UNSYNCROLES');

export { create, remove, update, unSyncRoles };
