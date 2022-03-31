/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import actions from '../../actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import { unSyncCurrentUser } from '../currentUser/actions';

const create: Function = createAction(
  'USERS_CREATE',
  async (
    name: string,
    username: string,
    pass: string,
    roles: Array<string>,
    dispatch: Function
    // @ts-ignore ts-migrate(1055) FIXME: Type 'ObjectConstructor' is not a valid async func... Remove this comment to see the full error message
  ): Object => {
    if (!dispatch) {
      return {
        name,
        username,
        pass,
        roles,
      };
    }

    await fetchWithNotifications(
      async () =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
        await fetchJson('POST', `${settings.REST_BASE_URL}/users/`, {
          body: JSON.stringify({
            name,
            username,
            pass,
            roles,
          }),
        }),
      'Creating new user...',
      'User successfuly created',
      dispatch
    );

    dispatch(unSyncCurrentUser());
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    dispatch(actions.currentUser.fetch());
  }
);

const remove: Function = createAction(
  'USERS_REMOVE',
  // @ts-ignore ts-migrate(1055) FIXME: Type 'Object' is not a valid async function return... Remove this comment to see the full error message
  async (username: string, dispatch: Function): Object => {
    if (!dispatch) {
      return { username };
    }

    await fetchWithNotifications(
      async () =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
        await fetchJson(
          'DELETE',
          `${settings.REST_BASE_URL}/users/${encodeURIComponent(username)}`
        ),
      'Deleting user...',
      'User successfuly deleted',
      dispatch
    );

    dispatch(unSyncCurrentUser());
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    dispatch(actions.currentUser.fetch());
  }
);

const update: Function = createAction(
  'USERS_UPDATE',
  async (
    name: string,
    username: string,
    pass: string,
    roles: Array<string>,
    dispatch: Function
    // @ts-ignore ts-migrate(1055) FIXME: Type 'Object' is not a valid async function return... Remove this comment to see the full error message
  ): Object => {
    if (!dispatch && name) {
      return {
        name,
        username,
        roles,
      };
    }

    await fetchWithNotifications(
      async () =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
        await fetchJson('PUT', `${settings.REST_BASE_URL}/users/${encodeURIComponent(username)}`, {
          body: JSON.stringify({
            name,
            username,
            pass,
            roles,
          }),
        }),
      'Updating user...',
      'User successfuly updated',
      dispatch
    );

    if (!name) {
      dispatch(unSyncCurrentUser());
      // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      dispatch(actions.currentUser.fetch());
    }
  }
);

const unSyncUsers: Function = createAction('USERS_UNSYNCUSERS');

export { create, remove, update, unSyncUsers };
