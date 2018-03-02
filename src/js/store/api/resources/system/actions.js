/* @flow */
import { createAction } from 'redux-actions';

const addProcess: Function = createAction(
  'SYSTEM_ADDPROCESS',
  (events: Array<Object>): Object => ({ events })
);

const removeProcess: Function = createAction(
  'SYSTEM_ADDPROCESS',
  (events: Array<Object>): Object => ({ events })
);

const processMemoryChanged: Function = createAction(
  'SYSTEM_PROCESSMEMORYCHANGED',
  (events: Array<Object>): Object => ({ events })
);

const updateDone = createAction('WORKFLOWS_UPDATEDONE', id => ({ id }));

export { addProcess, processMemoryChanged, removeProcess, updateDone };
