/* @flow */
import { createAction } from 'redux-actions';

const unSyncCurrentUser: Function = createAction(
  'CURRENTUSER_UNSYNCCURRENTUSER',
);

export {
  unSyncCurrentUser,
};
