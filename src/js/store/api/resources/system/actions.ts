/* @flow */
import { createAction } from 'redux-actions';
import settings from '../../../../settings';
import {
  addAppenderAction,
  addUpdateLoggerAction,
  deleteAppenderAction,
  deleteConfigItemAction,
  deleteLoggerAction,
  editAppenderAction,
  fetchLoggerAction,
  updateConfigItemAction,
  updateConfigItemWsCommon,
} from '../../common/actions';
import { fetchWithNotifications, get, post } from '../../utils';

const init: Function = createAction('SYSTEM_INIT');
const unsync: Function = createAction('SYSTEM_UNSYNC');

const addProcess: Function = createAction('SYSTEM_ADDPROCESS', (events: Array<Object>): any => ({
  events,
}));

const updateLicense: Function = createAction(
  'SYSTEM_UPDATELICENSE',
  (events: Array<Object>): any => ({
    events,
  })
);

const removeProcess: Function = createAction(
  'SYSTEM_REMOVEPROCESS',
  (events: Array<Object>): any => ({ events })
);

const processMemoryChanged: Function = createAction(
  'SYSTEM_PROCESSMEMORYCHANGED',
  (events: Array<Object>): any => ({ events })
);

const incrementItems: Function = createAction(
  'SYSTEM_INCREMENTITEMS',
  (events: Array<Object>): any => ({ events })
);

const decrementItems: Function = createAction(
  'SYSTEM_DECREMENTITEMS',
  (events: Array<Object>): any => ({ events })
);

const updateStats: Function = createAction('SYSTEM_UPDATESTATS', (events: Array<Object>): any => ({
  events,
}));

const updateNodeInfo: Function = createAction(
  'SYSTEM_UPDATENODEINFO',
  (events: Array<Object>): any => ({ events })
);

const removeNode: Function = createAction('SYSTEM_REMOVENODE', (events: Array<Object>): any => ({
  events,
}));

const healthChanged: Function = createAction(
  'SYSTEM_HEALTHCHANGED',
  (events: Array<Object>): any => ({ events })
);

const remoteHealthChanged: Function = createAction(
  'SYSTEM_REMOTEHEALTHCHANGED',
  (events: Array<Object>): any => ({ events })
);

const killProcess: Function = createAction(
  'SYSTEM_KILLPROCESS',
  (processId: number, onFinish: Function, dispatch: Function): void => {
    fetchWithNotifications(
      async () => {
        const res = await post(
          `${settings.REST_BASE_URL}/system/processes/${processId}?action=kill`
        );

        if (!res.err && onFinish) {
          onFinish();
        }

        return res;
      },
      `Killing process ${processId}...`,
      `Process ${processId} killed.`,
      dispatch
    );
  }
);

// Config items
const fetchGlobalConfig: Function = createAction('SYSTEM_FETCHGLOBALCONFIG', async () => {
  const globalConfig = await get(`${settings.REST_BASE_URL}/system/config`);

  return { globalConfig };
});

const updateConfigItemWs: Function = updateConfigItemWsCommon('SYSTEM');
const updateConfigItem: Function = updateConfigItemAction('SYSTEM');
const deleteConfigItem: Function = deleteConfigItemAction('SYSTEM');

const updateDone = createAction('SYSTEM_UPDATEDONE', (id) => ({ id }));

// LOGGER
const fetchLogger = fetchLoggerAction('system');
const fetchDefaultLogger = createAction(
  `SYSTEM_FETCHDEFAULTLOGGER`,
  async (intfc, url?: string) => {
    const [logger, appenders] = await Promise.all([
      get(`${settings.REST_BASE_URL}/${url || intfc}?action=defaultLogger`),
      get(`${settings.REST_BASE_URL}/${url || intfc}?action=defaultLoggerAppenders`),
    ]);

    return {
      empty: logger === 'success',
      logger,
      appenders: appenders === 'success' ? [] : appenders,
      intfc,
    };
  }
);
const addUpdateLogger = addUpdateLoggerAction('system');
const addUpdateDefaultLogger = createAction(
  'SYSTEM_ADDUPDATEDEFAULTLOGGER',
  (events: Array<Object>): any => ({ events })
);
// Deleting loggers
const deleteLogger = deleteLoggerAction('system');
const deleteDefaultLogger = createAction(
  'SYSTEM_DELETEDEFAULTLOGGER',
  (events: Array<Object>): any => ({ events })
);
const addAppender = addAppenderAction('system');
const editAppender = editAppenderAction('system');
const addDefaultAppender = createAction(
  'SYSTEM_ADDDEFAULTAPPENDER',
  (events: Array<Object>): any => ({ events })
);
const editDefaultAppender = createAction(
  'SYSTEM_EDITDEFAULTAPPENDER',
  (events: Array<Object>): any => ({ events })
);
const deleteAppender = deleteAppenderAction('system');
const deleteDefaultAppender = createAction(
  'SYSTEM_DELETEDEFAULTAPPENDER',
  (events: Array<Object>): any => ({ events })
);

export {
  addAppender,
  addDefaultAppender,
  addProcess,
  addUpdateDefaultLogger,
  addUpdateLogger,
  decrementItems,
  deleteAppender,
  deleteConfigItem,
  deleteDefaultAppender,
  deleteDefaultLogger,
  deleteLogger,
  editAppender,
  editDefaultAppender,
  fetchDefaultLogger,
  fetchGlobalConfig,
  fetchLogger,
  healthChanged,
  incrementItems,
  init,
  killProcess,
  processMemoryChanged,
  remoteHealthChanged,
  removeNode,
  removeProcess,
  unsync,
  updateConfigItem,
  updateConfigItemWs,
  updateDone,
  updateLicense,
  updateNodeInfo,
  updateStats,
};
