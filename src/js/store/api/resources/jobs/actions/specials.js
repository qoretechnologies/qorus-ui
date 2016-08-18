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


const fetchResultsPayload = baseUrl => (model, offset = 0, limit = 50) => fetchJson(
  'GET', `${baseUrl}/${model.id}/results?offset=${offset}&limit=${limit}`
);
const fetchResultsMeta = ({ id: modelId }, offset = 0, limit = 50) => (
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


const fetchResults = (model, offset, limit) => dispatch => {
  dispatch(startFetchingResults(model));
  dispatch(fetchResultsCall(model, offset, limit));
};

export { setOptions, fetchLibSources, fetchResults, startFetchingResults };
