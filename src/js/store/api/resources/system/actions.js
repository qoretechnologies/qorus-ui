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

const incrementItems: Function = createAction(
  'SYSTEM_INCREMENTITEMS',
  (events: Array<Object>): Object => ({ events })
);

const updateStats: Function = createAction(
  'SYSTEM_UPDATESTATS',
  (events: Array<Object>): Object => ({ events })
);

const updateNodeInfo: Function = createAction(
  'SYSTEM_UPDATENODEINFO',
  (events: Array<Object>): Object => ({ events })
);

const updateDone = createAction('SYSTEM_UPDATEDONE', id => ({ id }));

export {
  addProcess,
  processMemoryChanged,
  removeProcess,
  updateDone,
  incrementItems,
  updateStats,
  updateNodeInfo,
};
