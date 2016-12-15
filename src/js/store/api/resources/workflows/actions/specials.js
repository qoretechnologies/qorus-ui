import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';

function setOptionsPayload(workflow, name, value) {
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

function setOptionsMeta(workflow, name, value) {
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


function fetchLibSourcesPayload(workflow) {
  const id = typeof workflow === 'object' ? workflow.id : workflow;

  return fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/workflows/${id}?lib_source=true`
  );
}

function fetchLibSourcesMeta(workflow) {
  const workflowId = typeof workflow === 'object' ? workflow.id : workflow;

  return { workflowId };
}

const fetchLibSources = createAction(
  'WORKFLOWS_FETCHLIBSOURCES',
  fetchLibSourcesPayload,
  fetchLibSourcesMeta
);

const setExecCount = createAction(
  'WORKFLOWS_SETEXECCOUNT',
  (workflowid, value) => ({ workflowid, value })
);

const setEnabled = createAction(
  'WORKFLOWS_SETENABLED',
  (workflowid, value, update) => ({ workflowid, value, update })
);

const unselectAll = createAction('WORKFLOWS_UNSELECTALL');

const updateDone = createAction(
  'WORKFLOWS_UPDATEDONE',
  (id) => ({ id })
);

const addOrder = createAction(
  'WORKFLOWS_ADDORDER',
  (id, status) => ({ id, status })
);

const modifyOrder = createAction(
  'WORKFLOWS_MODIFYORDER',
  (id, oldStatus, newStatus) => ({ id, oldStatus, newStatus })
);

const addAlert = createAction(
  'WORKFLOWS_ADDALERT',
  (data) => ({ data })
);

const clearAlert = createAction(
  'WORKFLOWS_CLEARALERT',
  (id, alertid) => ({ id, alertid })
);

const select = createAction(
  'WORKFLOWS_SELECT',
  (id) => ({ id })
);

const selectAll = createAction('WORKFLOWS_SELECTALL');
const selectNone = createAction('WORKFLOWS_SELECTNONE');
const selectInvert = createAction('WORKFLOWS_SELECTINVERT');
const selectRunning = createAction('WORKFLOWS_SELECTRUNNING');
const selectStopped = createAction('WORKFLOWS_SELECTSTOPPED');

const toggleEnabledAction = createAction(
  'WORKFLOWS_ENABLECALL',
  (ids, value) => {
    const id = isArray(ids) ? ids.join(',') : ids;

    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/workflows?ids=${id}&action=${value ? 'enable' : 'disable'}`
    );
  }
);

const reset = createAction(
  'WORKFLOWS_RESETCALL',
  (ids) => {
    const id = isArray(ids) ? ids.join(',') : ids;

    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/workflows?ids=${id}&action=reset`
    );
  }
);

const toggleStart = createAction(
  'WORKFLOWS_STARTCALL',
  (ids, type) => {
    const id = isArray(ids) ? ids.join(',') : ids;

    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/workflows?ids=${id}&action=${type}`
    );
  }
);

const toggleDeprecated = createAction(
  'WORKFLOWS_TOGGLEDEPRECATED',
  (ids, value) => {
    const id = isArray(ids) ? ids.join(',') : ids;

    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/workflows?ids=${id}&action=setDeprecated&deprecated=${value}`
    );

    return { ids, value };
  }
);

const setAutostart = createAction(
  'WORKFLOWS_SETAUTOSTART',
  (id, value) => {
    fetchJson(
      'PUT',
      `${settings.REST_BASE_URL}/workflows/${id}?action=setAutostart&autostart=${value}`
    );

    return { id, value };
  }
);

const toggleEnabled = (id, value) => (dispatch) => {
  dispatch(toggleEnabledAction(id, value));
};

const unsync = createAction('WORKFLOWS_UNSYNC');

export {
  setOptions,
  fetchLibSources,
  setExecCount,
  setEnabled,
  unselectAll,
  updateDone,
  addOrder,
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
  toggleEnabled,
  reset,
  setAutostart,
  toggleStart,
  toggleDeprecated,
};
