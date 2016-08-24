/* @flow */
import { createAction } from 'redux-actions';
import { fetchJson } from '../../utils';
import settings from '../../../../settings';
import { unSyncCurrentUser } from '../currentUser/actions';
import actions from '../../actions';

const createOptimistic: Function = (
  name: string,
  username: string,
  pass: string,
  roles: Array<string>,
): Object => ({
  name,
  username,
  pass,
  roles,
});
const create: Function = (
  name: string,
  username: string,
  pass: string,
  roles: Array<string>,
): Object => (
  fetchJson(
    'POST',
    `${settings.REST_BASE_URL}/users/`,
    {
      body: JSON.stringify({
        name,
        username,
        pass,
        roles,
      }),
    }
  )
);

const removeOptimistic: Function = (username: string) => ({ username });
const remove: Function = async (username: string): Object => (
  fetchJson(
    'DELETE',
    `${settings.REST_BASE_URL}/users/${username}`
  )
);

const updateOptimistic: Function = async (
  name: string, username: string, roles: Array<string>
): Object => ({
  name,
  username,
  roles,
});
const update: Function = async (name: string, username: string, roles: Array<string>): Object => (
  fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/users/${username}`,
    {
      body: JSON.stringify({
        name,
        username,
        roles,
      }),
    }
  )
);

const createOptimisticCall: Function = createAction(
  'USERS_CREATEUSEROPTIMISTIC',
  createOptimistic
);
const createCall: Function = createAction(
  'USERS_CREATEUSER',
  create
);

const removeOptimisticCall: Function = createAction(
  'USERS_REMOVEUSEROPTIMISTIC',
  removeOptimistic
);
const removeCall: Function = createAction(
  'USERS_REMOVEUSER',
  remove
);

const updateOptimisticCall: Function = createAction(
  'USERS_UPDATEUSEROPTIMISTIC',
  updateOptimistic
);
const updateCall: Function = createAction(
  'USERS_UPDATEUSER',
  update
);

const unSyncUsers: Function = createAction(
  'USERS_UNSYNCUSERS'
);


const createUser: Function = (
  name: string, username: string, pass: string, roles: Array<string>
) => dispatch => {
  dispatch(createCall(name, username, pass, roles));
  dispatch(createOptimisticCall(name, username, pass, roles));
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const updateUser: Function = (
  name: string, username: string, roles: Array<string>
) => dispatch => {
  dispatch(updateCall(name, username, roles));
  dispatch(updateOptimisticCall(name, username, roles));
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const removeUser: Function = (username: string) => dispatch => {
  dispatch(removeCall(username));
  dispatch(removeOptimisticCall(username));
  dispatch(unSyncCurrentUser());
  dispatch(actions.currentUser.fetch());
};

const removeUserOptimistic: Function = () => () => true;
const createUserOptimistic: Function = () => () => true;
const updateUserOptimistic: Function = () => () => true;

export {
  createUser,
  createUserOptimistic,
  removeUser,
  removeUserOptimistic,
  updateUser,
  updateUserOptimistic,
  unSyncUsers,
};
