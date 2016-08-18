import { createAction } from 'redux-actions';


import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';

const jobsUrl = `${settings.REST_BASE_URL}/jobs`;


const setOptionsPayload = baseUrl => (model, name, value) => (
  fetchJson(
    'PUT',
    `${baseUrl}/${model.id}`,
    {
      body: JSON.stringify({
        action: 'setOptions',
        options: `${name}=${value}`,
      }),
    }
  )
);

function setOptionsMeta(model, name, value) {
  return {
    modelId: model.id,
    option: { name, value },
  };
}

const setOptions = createAction(
  'JOBS_SETOPTIONS',
  setOptionsPayload,
  setOptionsMeta
);


const fetchLibSourcesPayload = baseUrl => model => (
  fetchJson(
    'GET',
    `${baseUrl}/${model.id}?lib_source=true`
  )
);

function fetchLibSourcesMeta(model) {
  return { modelId: model.id };
}

const fetchLibSources = createAction(
  'JOBS_FETCHLIBSOURCES',
  fetchLibSourcesPayload(jobsUrl),
  fetchLibSourcesMeta
);


const fetchResultsPayload = baseUrl => model => fetchJson('GET', `${baseUrl}/${model.id}/results`);
const fetchResultsMeta = ({ id: modelId }) => ({ modelId });

const fetchResults = createAction(
  'JOBS_FETCHRESULTS',
  fetchResultsPayload(jobsUrl),
  fetchResultsMeta
);

export { setOptions, fetchLibSources, fetchResults };
