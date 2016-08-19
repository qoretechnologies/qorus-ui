import { createAction } from 'redux-actions';
import queryString from 'query-string';


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


const fetchResultsPayload = baseUrl => (model, query, offset = 0, limit = 50) => fetchJson(
  'GET', `${baseUrl}/${model.id}/results?${queryString.stringify({ ...query, limit, offset })}`
);
const fetchResultsMeta = ({ id: modelId }, query, offset = 0, limit = 50) => (
  { modelId, offset, limit }
);
const fetchResultsCall = createAction(
  'JOBS_FETCHRESULTS',
  fetchResultsPayload(jobsUrl),
  fetchResultsMeta
);

const startFetchingResults = createAction(
  'JOBS_STARTFETCHINGRESULTS',
  () => ({}),
  ({ id: modelId }) => ({ modelId })
);

const fetchResults = (...args) => dispatch => {
  dispatch(startFetchingResults(...args));
  dispatch(fetchResultsCall(...args));
};

const clearResults = createAction(
  'JOBS_CLEARRESULTS',
  () => ({}),
  ({ id: modelId }) => ({ modelId })
);

export { setOptions, fetchLibSources, fetchResults, clearResults, startFetchingResults };
