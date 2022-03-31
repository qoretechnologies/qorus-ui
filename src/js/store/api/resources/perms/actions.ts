/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import actions from '../../actions';
import { fetchJson, fetchWithNotifications } from '../../utils';
import { unSyncCurrentUser } from '../currentUser/actions';
import { unSyncRoles } from '../roles/actions';
import { unSyncUsers } from '../users/actions';

const createPerm: Function = createAction(
  'PERMS_CREATEPERM',
  // @ts-ignore ts-migrate(1055) FIXME: Type 'Object' is not a valid async function return... Remove this comment to see the full error message
  async (name: string, desc: string, dispatch: Function): Object => {
    if (dispatch) {
      const res: Object = await fetchWithNotifications(
        async () =>
          // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
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

      // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
      if (!res.err) {
        dispatch(unSyncRoles());
        dispatch(unSyncUsers());
        dispatch(unSyncCurrentUser());
        // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
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
          // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
          await fetchJson('DELETE', `${settings.REST_BASE_URL}/perms/${name}`),
        'Deleting permission...',
        'Deleted successfully',
        dispatch
      );

      if (res.err) {
        dispatch(unSyncRoles());
        dispatch(unSyncUsers());
        dispatch(unSyncCurrentUser());
        // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
        dispatch(actions.currentUser.fetch());
      }

      return;
    }

    return { name };
  }
);

const updatePerm: Function = createAction(
  'PERMS_UPDATEPERM',
  // @ts-ignore ts-migrate(1055) FIXME: Type 'Object' is not a valid async function return... Remove this comment to see the full error message
  async (name: string, desc: string, dispatch: Function): Object => {
    if (dispatch) {
      await fetchWithNotifications(
        async () =>
          // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
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
