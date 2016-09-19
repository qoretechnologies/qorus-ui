import { createAction } from 'redux-actions';
import queryString from 'query-string';


import { fetchJson, fetchText, fetchData } from '../../../utils';
import settings from '../../../../../settings';

const jobsUrl = `${settings.REST_BASE_URL}/jobs`;

/**
 * If action is optimistic return payload { modelId, option }.
 * If action isn't optimistic then send real request
 * If real request is success return payload { modelId, option }
 * If real request is failed then error will throws
 * @param {Object} model
 * @param {Object} opt
 * @param {Boolean} optimistic
 * @returns {*}
 */
const setOptionsPayload = async (model, opt, optimistic) => {
  const newOpt = { name: opt.name, value: opt.value, desc: opt.desc };
  if (optimistic) {
    return {
      option: newOpt,
    };
  }

  await fetchData(
    'PUT',
    `${settings.REST_BASE_URL}/jobs/${model.id}`,
    {
      body: JSON.stringify({
        action: 'setOptions',
        options: { [opt.name]: opt.value },
      }),
    }
  );
  return { option: newOpt };
};

const setOptionsMeta = (model, opt, optimistic) => ({
  modelId: model.id,
  option: { name: opt.name, value: opt.value },
  optimistic,
});

const setOptionsAction = createAction(
  'JOBS_SETOPTIONS',
  setOptionsPayload,
  setOptionsMeta
);

/**
 * Sends real and optimistic actions to set option
 * @param {Object} model model that should be updated
 * @param {Object} opt updated option
 */
const setOptions = (model, opt) => dispatch => {
  dispatch(setOptionsAction(model, opt, true));
  dispatch(setOptionsAction(model, opt));
};


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

const setExpirationDatePayload = async (job, date, optimistic) => {
  if (optimistic) {
    return { ...job, expiry_date: date };
  }

  const updatedInfo = await fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/jobs/${job.id}`,
    {
      body: JSON.stringify({
        date,
        action: 'setExpiry',
      }),
    }
  );

  return { ...job, ...updatedInfo };
};

const setExpirationDateMeta = (job, date, optimistic = false) => ({
  job,
  date,
  optimistic,
});

const setExpirationDateAction = createAction(
  'JOBS_SETEXPIRATIONDATE',
  setExpirationDatePayload,
  setExpirationDateMeta
);

const setExpirationDate = (job, date) => dispatch => {
  dispatch(setExpirationDateAction(job, date, true));
  dispatch(setExpirationDateAction(job, date));
};

const fetchCodePayload = async (job) => ({
  code: await fetchText('GET', `${settings.REST_BASE_URL}/jobs/${job.id}/code`),
});
const fetchCodeMeta = (job) => ({ job });

const fetchCode = createAction('JOBS_FETCHCODE', fetchCodePayload, fetchCodeMeta);

export {
  setOptions,
  fetchLibSources,
  fetchResults,
  clearResults,
  startFetchingResults,
  setExpirationDate,
  fetchCode,
};
