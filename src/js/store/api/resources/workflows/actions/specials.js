import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';

import { fetchJson, fetchWithNotifications } from '../../../utils';
import settings from '../../../../../settings';
import {
  updateConfigItemAction,
  updateBasicDataAction,
  fetchLoggerAction,
  addUpdateLoggerAction,
  deleteLoggerAction,
  addAppenderAction,
  deleteAppenderAction,
} from '../../../common/actions';

const updateBasicData = updateBasicDataAction('WORKFLOWS');

function setOptionsPayload (workflow, name, value) {
  return fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/workflows/${workflow.id}`,
    {
      body: JSON.stringify({
        action: 'setOptions',
        options: `${name}=${value}`,
      }),
    }
  );
}

function setOptionsMeta (workflow, name, value) {
  return {
    workflowId: workflow.id,
    option: { name, value },
  };
}

const setOptions = createAction(
  'WORKFLOWS_SETOPTIONS',
  setOptionsPayload,
  setOptionsMeta
);

function fetchLibSourcesPayload (workflow, date) {
  const id = typeof workflow === 'object' ? workflow.id : workflow;

  return fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/workflows/${id}?lib_source=true&date=${date}`
  );
}

function fetchLibSourcesMeta (workflow) {
  const workflowId = typeof workflow === 'object' ? workflow.id : workflow;

  return { workflowId };
}

const fetchLibSources = createAction(
  'WORKFLOWS_FETCHLIBSOURCES',
  fetchLibSourcesPayload,
  fetchLibSourcesMeta
);

const addNew = createAction('WORKFLOWS_ADDNEW', async id => {
  const wf = await fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/workflows/${id}`
  );

  return { wf };
});

const setExecCount = createAction('WORKFLOWS_SETEXECCOUNT', events => ({
  events,
}));

const setEnabled = createAction('WORKFLOWS_SETENABLED', events => ({ events }));
const unselectAll = createAction('WORKFLOWS_UNSELECTALL');
const updateDone = createAction('WORKFLOWS_UPDATEDONE', id => ({ id }));
const addOrder = createAction('WORKFLOWS_ADDORDER', events => ({ events }));

const processOrderEvent = createAction(
  'WORKFLOWS_PROCESSORDEREVENT',
  events => ({ events })
);

const modifyOrder = createAction('WORKFLOWS_MODIFYORDER', events => ({
  events,
}));

const fixOrders = createAction('WORKFLOWS_FIXORDERS', events => ({
  events,
}));

const addAlert = createAction('WORKFLOWS_ADDALERT', events => ({ events }));

const clearAlert = createAction('WORKFLOWS_CLEARALERT', events => ({ events }));
const updateStats = createAction('WORKFLOWS_UPDATESTATS', events => ({
  events,
}));

const processStarted = createAction('WORKFLOWS_PROCESSSTARTED', events => ({
  events,
}));
const processStopped = createAction('WORKFLOWS_PROCESSSTOPPED', events => ({
  events,
}));
const processMemoryChanged = createAction(
  'WORKFLOWS_PROCESSMEMORYCHANGED',
  events => ({ events })
);

const select = createAction('WORKFLOWS_SELECT', id => ({ id }));
const selectAll = createAction('WORKFLOWS_SELECTALL');
const selectNone = createAction('WORKFLOWS_SELECTNONE');
const selectInvert = createAction('WORKFLOWS_SELECTINVERT');
const selectRunning = createAction('WORKFLOWS_SELECTRUNNING');
const selectStopped = createAction('WORKFLOWS_SELECTSTOPPED');
const selectAlerts = createAction('WORKFLOWS_SELECTALERTS');

const toggleEnabled = createAction(
  'WORKFLOWS_ENABLE',
  (ids, value, dispatch) => {
    const id = isArray(ids) ? ids.join(',') : ids;

    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/workflows?ids=${id}&action=${
            value ? 'enable' : 'disable'
          }`
        ),
      `Enabling workflow(s) ${id}...`,
      `Workflow(s) ${id} ${value ? 'enabled' : 'disabled'}`,
      dispatch
    );
  }
);

const fetchList = createAction('WORKFLOWS_FETCHLIST', async () => {
  const result = await fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/workflows?list=1`
  );

  return { result };
});

const reset = createAction('WORKFLOWS_RESETCALL', async (ids, dispatch) => {
  const id = isArray(ids) ? ids.join(',') : ids;

  fetchWithNotifications(
    async () =>
      await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/workflows?ids=${id}&action=reset`
      ),
    `Reseting workflow(s) ${id}...`,
    `Workflow(s) ${id} reset`,
    dispatch
  );
});

const toggleStart = createAction(
  'WORKFLOWS_STARTCALL',
  (ids, type, dispatch) => {
    const id = isArray(ids) ? ids.join(',') : ids;

    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/workflows?ids=${id}&action=${type}`
        ),
      `${type === 'stop' ? 'Stopping' : 'Starting'} workflow(s) ${id}...`,
      `Workflow(s) ${id} ${type === 'stop' ? 'stopped' : 'started'}`,
      dispatch
    );
  }
);

const toggleDeprecated = createAction(
  'WORKFLOWS_TOGGLEDEPRECATED',
  (ids, value, dispatch) => {
    const id = isArray(ids) ? ids.join(',') : ids;

    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${
            settings.REST_BASE_URL
          }/workflows?ids=${id}&action=setDeprecated&deprecated=${value}`
        ),
      `${value ? 'Setting' : 'Unsetting'} workflow(s) ${id} as deprecated...`,
      `Workflow(s) ${id} ${value ? 'set' : 'unset'} as deprecated`,
      dispatch
    );

    return { ids, value };
  }
);

const setAutostart = createAction(
  'WORKFLOWS_SETAUTOSTART',
  (id, value, dispatch) => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${
            settings.REST_BASE_URL
          }/workflows/${id}?action=setAutostart&autostart=${value}`
        ),
      `${
        value ? 'Setting' : 'Unsetting'
      } workflow ${id} autostart to ${value}...`,
      `Workflow ${id} autostart set to ${value}`,
      dispatch
    );
  }
);

const setThreshold = createAction(
  'WORKFLOWS_SETTHRESHOLD',
  (id, value, dispatch) => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/workflows/${id}?action=setSla&sla=${value}`
        ),
      `Setting workflow ${id} threshold to ${value}...`,
      `Workflow ${id} threshold set to ${value}`,
      dispatch
    );

    return { id, value };
  }
);

const setRemote = createAction('WORKFLOWS_SETREMOTE', (id, value, dispatch) => {
  const remoteStr: string = `${value ? 'remote' : 'not remote'}`;

  fetchWithNotifications(
    async () =>
      await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/workflows/${id}?action=setRemote&remote=${
          value ? 1 : 0
        }`
      ),
    `Setting workflow ${id} as ${remoteStr}...`,
    `Workflow ${id} set to ${remoteStr}`,
    dispatch
  );
});

const updateConfigItem: Function = updateConfigItemAction('WORKFLOWS');
const updateConfigItemWs = createAction(
  'WORKFLOWS_UPDATECONFIGITEMWS',
  events => ({ events })
);

const unsync = createAction('WORKFLOWS_UNSYNC');
const fetchLogger = fetchLoggerAction('workflows');
const addUpdateLogger = addUpdateLoggerAction('workflows');
const deleteLogger = deleteLoggerAction('workflows');
const addAppender = addAppenderAction('workflows');
const deleteAppender = deleteAppenderAction('workflows');

export {
  setOptions,
  fetchLibSources,
  setExecCount,
  setEnabled,
  unselectAll,
  updateDone,
  addOrder,
  processOrderEvent,
  modifyOrder,
  addAlert,
  clearAlert,
  unsync,
  select,
  selectAll,
  selectNone,
  selectInvert,
  selectRunning,
  selectStopped,
  selectAlerts,
  toggleEnabled,
  reset,
  setAutostart,
  toggleStart,
  toggleDeprecated,
  fetchList,
  addNew,
  processMemoryChanged,
  processStarted,
  processStopped,
  updateStats,
  setThreshold,
  setRemote,
  fixOrders,
  updateConfigItem,
  updateConfigItemWs,
  updateBasicData,
  fetchLogger,
  addUpdateLogger,
  deleteLogger,
  addAppender,
  deleteAppender,
};
