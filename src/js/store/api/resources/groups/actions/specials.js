/* @flow */
import { createAction } from 'redux-actions';

const setEnabled: Function = createAction(
  'GROUPS_SETENABLED',
  (events) => ({ events })
);

const updateDone: Function = createAction(
  'GROUPS_UPDATEDONE',
  (name: string) => ({ name })
);

export {
  setEnabled,
  updateDone,
};
