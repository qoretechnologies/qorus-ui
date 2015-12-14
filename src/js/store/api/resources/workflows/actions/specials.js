import { createAction } from 'redux-actions';


import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';


function setOptionsPayload(workflow, name, value) {
  return fetchJson(
    'PUT',
    `${settings.REST_API_PREFIX}/workflows/${workflow.id}`,
    {
      body: JSON.stringify({
        action: 'setOptions',
        options: `${name}=${value}`
      })
    }
  );
}

function setOptionsMeta(workflow, name, value) {
  return {
    workflowId: workflow.id,
    option: { name, value }
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
    `${settings.REST_API_PREFIX}/workflows/${workflow.id}?lib_source=true`
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


export { setOptions, fetchLibSources };
