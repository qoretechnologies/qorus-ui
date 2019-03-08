/* @flow */
import { createAction } from 'redux-actions';
import { fetchWithNotifications, post, get } from '../../utils';
import settings from '../../../../settings';

import {
  fetchLoggerAction,
  addUpdateLoggerAction,
  deleteLoggerAction,
  addAppenderAction,
  deleteAppenderAction,
} from '../../common/actions';

const init: Function = createAction('SYSTEM_INIT');
const unsync: Function = createAction('SYSTEM_UNSYNC');

const addProcess: Function = createAction(
  'SYSTEM_ADDPROCESS',
  (events: Array<Object>): Object => ({ events })
);

const removeProcess: Function = createAction(
  'SYSTEM_REMOVEPROCESS',
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

const decrementItems: Function = createAction(
  'SYSTEM_DECREMENTITEMS',
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

const healthChanged: Function = createAction(
  'SYSTEM_HEALTHCHANGED',
  (events: Array<Object>): Object => ({ events })
);

const remoteHealthChanged: Function = createAction(
  'SYSTEM_REMOTEHEALTHCHANGED',
  (events: Array<Object>): Object => ({ events })
);

const killProcess: Function = createAction(
  'SYSTEM_KILLPROCESS',
  (processId: number, onFinish: Function, dispatch: Function): void => {
    fetchWithNotifications(
      async () => {
        await post(
          `${settings.REST_BASE_URL}/system/processes/${processId}?action=kill`
        );
        onFinish();
      },
      `Killing process ${processId}...`,
      `Process ${processId} killed.`,
      dispatch
    );
  }
);

// Config items
const fetchGlobalConfig: Function = createAction(
  'SYSTEM_FETCHGLOBALCONFIG',
  async () => {
    const globalConfig = await get(`${settings.REST_BASE_URL}/system/config`);

    return { globalConfig };
  }
);

const updateGlobalConfigItemWs: Function = createAction(
  'SYSTEM_UPDATEGLOBALCONFIGITEMWS',
  (events: Array<Object>): Object => ({ events })
);

const updateDone = createAction('SYSTEM_UPDATEDONE', id => ({ id }));

// LOGGER
const fetchLogger = fetchLoggerAction('system');
const addUpdateLogger = addUpdateLoggerAction('system');
const deleteLogger = deleteLoggerAction('system');
const addAppender = addAppenderAction('system');
const deleteAppender = deleteAppenderAction('system');

export {
  addProcess,
  processMemoryChanged,
  removeProcess,
  updateDone,
  incrementItems,
  decrementItems,
  updateStats,
  updateNodeInfo,
  init,
  unsync,
  healthChanged,
  remoteHealthChanged,
  killProcess,
  fetchGlobalConfig,
  updateGlobalConfigItemWs,
  fetchLogger,
  addUpdateLogger,
  deleteLogger,
  addAppender,
  deleteAppender,
};
