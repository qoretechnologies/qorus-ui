/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';
import { unSyncRoles } from '../roles/actions';
import { unSyncUsers } from '../users/actions';
import { unSyncCurrentUser } from '../currentUser/actions';
import actions from '../../actions';

const createOptimistic: Function = (name: string, desc: string) => ({ name, desc });
const create: Function = (
  name: string,
  desc: string,
): Object => (
  fetchJson(
    'POST',
    `${settings.REST_BASE_URL}/perms/`,
    {
      body: JSON.stringify({
        name,
        desc,
      }),
    }
  )
);

const removeOptimistic: Function = (name: string) => ({ name });
const remove: Function = (name: string) => (
  fetchJson(
    'DELETE',
    `${settings.REST_BASE_URL}/perms/${name}`,
  )
);

const updateOptimistic: Function = (name: string, desc: string) => ({ name, desc });
const update: Function = (
  name: string, desc: string
): Object => (
  fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/perms/${name}`,
    {
      body: JSON.stringify({
        name,
        desc,
      }),
    }
  )
);

const createOptimisticCall: Function = createAction(
  'PERMS_CREATEPERMOPTIMISTIC',
  createOptimistic
);

const createCall: Function = createAction(
  'PERMS_CREATEPERM',
  create
);

const createPerm: Function = (name: string, desc: string) => dispatch => {
  dispatch(createCall(name, desc));
  dispatch(createOptimisticCall(name, desc));
  dispatch(unSyncRoles());
  dispatch(unSyncUsers());
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const removeOptimisticCall: Function = createAction(
  'PERMS_REMOVEPERMOPTIMISTIC',
  removeOptimistic
);

const removeCall: Function = createAction(
  'PERMS_REMOVEPERM',
  remove
);

const removePerm: Function = (name: string) => dispatch => {
  dispatch(removeCall(name));
  dispatch(removeOptimisticCall(name));
  dispatch(unSyncRoles());
  dispatch(unSyncUsers());
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const updateOptimisticCall: Function = createAction(
  'PERMS_UPDATEPERMOPTIMISTIC',
  updateOptimistic
);

const updateCall: Function = createAction(
  'PERMS_UPDATEPERM',
  update
);

const updatePerm: Function = (name: string, desc: string) => dispatch => {
  dispatch(updateCall(name, desc));
  dispatch(updateOptimisticCall(name, desc));
};

const removePermOptimistic: Function = () => () => true;
const createPermOptimistic: Function = () => () => true;
const updatePermOptimistic: Function = () => () => true;

export {
  createPerm,
  createPermOptimistic,
  removePerm,
  removePermOptimistic,
  updatePerm,
  updatePermOptimistic,
};
