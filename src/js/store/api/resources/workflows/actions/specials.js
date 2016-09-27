import { createAction } from 'redux-actions';


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
  return fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/workflows/${workflow.id}?lib_source=true`
  );
}

function fetchLibSourcesMeta(workflow) {
  return { workflowId: workflow.id };
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
  (workflowid, value) => ({ workflowid, value })
);

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

export {
  setOptions,
  fetchLibSources,
  setExecCount,
  setEnabled,
  updateDone,
  addOrder,
  modifyOrder,
};
