/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';
import { unSyncCurrentUser } from '../currentUser/actions';
import actions from '../../actions';

const create: Function = createAction(
  'USERS_CREATE',
  async (
    name: string,
    username: string,
    pass: string,
    roles: Array<string>,
    dispatch: Function
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
    dispatch(actions.currentUser.fetch());
  }
);

const remove: Function = createAction(
  'USERS_REMOVE',
  async (username: string, dispatch: Function): ?Object => {
    if (!dispatch) {
      return { username };
    }

    await fetchWithNotifications(
      async () =>
        await fetchJson(
          'DELETE',
          `${settings.REST_BASE_URL}/users/${username}`
        ),
      'Deleting user...',
      'User successfuly deleted',
      dispatch
    );

    dispatch(unSyncCurrentUser());
    dispatch(actions.currentUser.fetch());
  }
);

const update: Function = createAction(
  'USERS_UPDATE',
  async (
    name: string,
    username: string,
    roles: Array<string>,
    dispatch: Function
  ): ?Object => {
    if (!dispatch) {
      return {
        name,
        username,
        roles,
      };
    }

    await fetchWithNotifications(
      async () =>
        await fetchJson('PUT', `${settings.REST_BASE_URL}/users/${username}`, {
          body: JSON.stringify({
            name,
            username,
            roles,
          }),
        }),
      'Updating user...',
      'User successfuly updated',
      dispatch
    );

    dispatch(unSyncCurrentUser());
    dispatch(actions.currentUser.fetch());
  }
);

const unSyncUsers: Function = createAction('USERS_UNSYNCUSERS');

export { create, remove, update, unSyncUsers };
