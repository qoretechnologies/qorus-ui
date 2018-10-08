/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import settings from '../../../../settings';
import { unSyncRoles } from '../roles/actions';
import { unSyncUsers } from '../users/actions';
import { unSyncCurrentUser } from '../currentUser/actions';
import actions from '../../actions';

const createPerm: Function = createAction(
  'PERMS_CREATEPERM',
  async (name: string, desc: string, dispatch: Function): ?Object => {
    if (dispatch) {
      const res: Object = await fetchWithNotifications(
        async () =>
          await fetchJson('POST', `${settings.REST_BASE_URL}/perms/`, {
            body: JSON.stringify({
              name,
              desc,
            }),
          }),
        'Creating...',
        'Successfuly created',
        dispatch
      );

      if (!res.err) {
        dispatch(unSyncRoles());
        dispatch(unSyncUsers());
        dispatch(unSyncCurrentUser());
        dispatch(actions.currentUser.fetch());
      }

      return;
    }

    return { name, desc };
  }
);

const removePerm: Function = createAction(
  'PERMS_REMOVEPERM',
  async (name: string, dispatch: Function) => {
    if (dispatch) {
      const res = await fetchWithNotifications(
        async () =>
          await fetchJson('DELETE', `${settings.REST_BASE_URL}/perms/${name}`),
        'Deleting permission...',
        'Deleted successfully',
        dispatch
      );

      if (res.err) {
        dispatch(unSyncRoles());
        dispatch(unSyncUsers());
        dispatch(unSyncCurrentUser());
        dispatch(actions.currentUser.fetch());
      }

      return;
    }

    return { name };
  }
);

const updatePerm: Function = createAction(
  'PERMS_UPDATEPERM',
  async (name: string, desc: string, dispatch: Function): ?Object => {
    if (dispatch) {
      await fetchWithNotifications(
        async () =>
          await fetchJson('PUT', `${settings.REST_BASE_URL}/perms/${name}`, {
            body: JSON.stringify({
              name,
              desc,
            }),
          }),
        'Updating...',
        'Successfuly updated',
        dispatch
      );

      return;
    }

    return { name, desc };
  }
);

export { createPerm, removePerm, updatePerm };
