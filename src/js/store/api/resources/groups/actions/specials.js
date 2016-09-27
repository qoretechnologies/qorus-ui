/* @flow */
import { createAction } from 'redux-actions';

const setEnabled: Function = createAction(
  'GROUPS_SETENABLED',
  (name: string, value: boolean) => ({ name, value })
);

const updateDone: Function = createAction(
  'GROUPS_UPDATEDONE',
  (name: string) => ({ name })
);

export {
  setEnabled,
  updateDone,
};
