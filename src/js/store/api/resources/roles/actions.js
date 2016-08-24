/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';
import { unSyncUsers } from '../users/actions';
import { unSyncCurrentUser } from '../currentUser/actions';
import actions from '../../actions';

const createOptimistic: Function = (
  role: string,
  desc: string,
  perms: Array<string>,
  groups: Array<string>
): Object => ({
  role,
  desc,
  perms,
  groups,
});

const create: Function = (
  role: string,
  desc: string,
  perms: Array<string>,
  groups: Array<string>,
): Object => (
  fetchJson(
    'POST',
    `${settings.REST_BASE_URL}/roles/`,
    {
      body: JSON.stringify({
        role,
        desc,
        perms,
        groups,
      }),
    }
  )
);

const removeOptimistic: Function = (role: string) => ({ role });
const remove: Function = (role: string): Object => (
  fetchJson(
    'DELETE',
    `${settings.REST_BASE_URL}/roles/${role}`
  )
);

const updateOptimistic = (
  role: string, desc: string, perms: Array<string>, groups: Array<string>
): Object => ({
  desc,
  role,
  perms,
  groups,
});
const update: Function = (
  role: string, desc: string, perms: Array<string>, groups: Array<string>
): Object => (
  fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/roles/${role}`,
    {
      body: JSON.stringify({
        desc,
        role,
        perms,
        groups,
      }),
    }
  )
);

const createOptimisticCall: Function = createAction(
  'ROLES_CREATEROLEOPTIMISTIC',
  createOptimistic
);
const createCall: Function = createAction(
  'ROLES_CREATEROLE',
  create
);

const removeOptimisticCall: Function = createAction(
  'ROLES_REMOVEROLEOPTIMISTIC',
  removeOptimistic
);
const removeCall: Function = createAction(
  'ROLES_REMOVEROLE',
  remove
);

const updateOptimisticCall: Function = createAction(
  'ROLES_UPDATEROLEOPTIMISTIC',
  updateOptimistic
);
const updateCall: Function = createAction(
  'ROLES_UPDATEROLE',
  update
);

const unSyncRoles: Function = createAction(
  'USERS_UNSYNCROLES'
);

const createRole: Function = (
  role: string, desc: string, perms: Array<string>, groups: Array<string>
) => dispatch => {
  dispatch(createCall(role, desc, perms, groups));
  dispatch(createOptimisticCall(role, desc, perms, groups));
  dispatch(unSyncUsers());
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const updateRole: Function = (
  role: string, desc: string, perms: Array<string>, groups: Array<string>
) => dispatch => {
  dispatch(updateCall(role, desc, perms, groups));
  dispatch(updateOptimisticCall(role, desc, perms, groups));
  dispatch(unSyncUsers());
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const removeRole: Function = (role: string) => dispatch => {
  dispatch(removeCall(role));
  dispatch(removeOptimisticCall(role));
  dispatch(unSyncUsers());
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const removeRoleOptimistic: Function = () => () => true;
const createRoleOptimistic: Function = () => () => true;
const updateRoleOptimistic: Function = () => () => true;

export {
  createRole,
  createRoleOptimistic,
  removeRole,
  removeRoleOptimistic,
  updateRole,
  updateRoleOptimistic,
  unSyncRoles,
};
