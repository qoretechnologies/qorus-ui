import { createAction } from 'redux-actions';
import queryString from 'query-string';
import isArray from 'lodash/isArray';

import {
  fetchJson,
  fetchText,
  fetchData,
  fetchWithNotifications,
} from '../../../utils';
import settings from '../../../../../settings';
import { error } from '../../../../ui/bubbles/actions';

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

  await fetchData('PUT', `${settings.REST_BASE_URL}/jobs/${model.id}`, {
    body: JSON.stringify({
      action: 'setOptions',
      options: { [opt.name]: opt.value },
    }),
  });
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

const fetchLibSourcesPayload = baseUrl => model =>
  fetchJson('GET', `${baseUrl}/${model.id}?lib_source=true&method_source=true`);

function fetchLibSourcesMeta(model) {
  return { modelId: model.id };
}

const fetchLibSources = createAction(
  'JOBS_FETCHLIBSOURCES',
  fetchLibSourcesPayload(jobsUrl),
  fetchLibSourcesMeta
);

const addNew = createAction('JOBS_ADDNEW', async id => {
  const job = await fetchJson('GET', `${settings.REST_BASE_URL}/jobs/${id}`);

  return { job };
});

const fetchResultsPayload = baseUrl => (model, query, offset = 0, limit = 50) =>
  fetchJson(
    'GET',
    `${baseUrl}/${model.id}/results?${queryString.stringify({
      ...query,
      limit,
      offset,
    })}`
  );
const fetchResultsMeta = ({ id: modelId }, query, offset = 0, limit = 50) => ({
  modelId,
  offset,
  limit,
});
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

const fetchCodePayload = async job => ({
  code: await fetchText('GET', `${settings.REST_BASE_URL}/jobs/${job.id}/code`),
});
const fetchCodeMeta = job => ({ job });

const fetchCode = createAction(
  'JOBS_FETCHCODE',
  fetchCodePayload,
  fetchCodeMeta
);
const setActive = createAction('JOBS_SETACTIVE', events => ({ events }));

const setEnabled = createAction('JOBS_SETENABLED', events => ({ events }));

const updateDone = createAction('JOBS_UPDATEDONE', id => ({ id }));

const instanceUpdateDone = createAction(
  'JOBS_INSTANCEUPDATEDONE',
  (jobid, id) => ({ jobid, id })
);

const addInstance = createAction('JOBS_ADDINSTANCE', events => ({ events }));

const modifyInstance = createAction('JOBS_MODIFYINSTANCE', events => ({
  events,
}));

const addAlert = createAction('JOBS_ADDALERT', events => ({ events }));

const clearAlert = createAction('JOBS_CLEARALERT', events => ({ events }));

const select = createAction('JOBS_SELECT', id => ({ id }));

const jobsAction = createAction(
  'JOBS_ACTION',
  async (action, ids, dispatch) => {
    const id = isArray(ids) ? ids.join(',') : ids;
    const url = `${settings.REST_BASE_URL}/jobs?ids=${id}&action=${action}`;

    fetchWithNotifications(
      async () => await fetchJson('PUT', url),
      `Executing ${action} on job(s) ${id}`,
      `${action} successfuly executed on job(s) ${ids}`,
      dispatch
    );

    return {};
  }
);

const expire = createAction('JOBS_EXPIRE', async (id, date, dispatch) => {
  if (!dispatch) return { id, date };

  fetchWithNotifications(
    async () =>
      await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/jobs/${id}?action=setExpiry&date=${date}`
      ),
    `Executing expire on ${id}`,
    `Expire change executed on ${id}`,
    dispatch
  );

  return { id, date };
});

const reschedule = createAction(
  'JOBS_RESCHEDULE',
  async (id, { minute, hour, day, month, wday }, dispatch) => {
    if (!dispatch) {
      return {
        id,
        minute,
        hour,
        day,
        month,
        wday,
      };
    }

    const cron = `${minute} ${hour} ${day} ${month} ${wday}`;
    const url = `${
      settings.REST_BASE_URL
    }/jobs/${id}?action=schedule&schedule=${cron}`;

    fetchWithNotifications(
      async () => await fetchJson('PUT', url),
      `Rescheduling job ${id}`,
      `Job ${id} rescheduled`,
      dispatch
    );

    return {
      id,
      minute,
      hour,
      day,
      month,
      wday,
    };
  }
);

const activate = createAction('JOBS_ACTIVATE', (id, active, dispatch) => {
  const url = `${
    settings.REST_BASE_URL
  }/jobs/${id}?action=setActive&active=${!active}`;

  fetchWithNotifications(
    async () => await fetchJson('PUT', url),
    `Activating job ${id}`,
    `Job ${id} activated`,
    dispatch
  );
});

const setSLAJob = createAction(
  'JOBS_SETSLAJOB',
  (job, sla, dispatch): Object => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/slas/${sla}?action=setJob&job=${job}`
        ),
      `Setting SLA for job ${job}`,
      `SLA for job ${job} set`,
      dispatch
    );
  }
);

const removeSLAJob = createAction(
  'JOBS_REMOVESLAJOB',
  (job, sla, dispatch): Object => {
    const url = `${settings.REST_BASE_URL}/slas/${sla}?`;
    const args = `action=removeJob&job=${job}`;

    fetchWithNotifications(
      async () => await fetchJson('PUT', url + args),
      `Removing SLA from job ${job}`,
      `SLA removed from job ${job}`,
      dispatch
    );
  }
);

const setRemote = createAction(
  'JOBS_SETREMOTE',
  async (id, value, dispatch) => {
    if (!dispatch) {
      return { id, value };
    }

    const result = await fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/jobs/${id}/setRemote`,
          {
            body: JSON.stringify({
              remote: value,
            }),
          }
        ),
      `Setting job ${id} as ${!value ? 'not' : ''} remote...`,
      `Set job ${id} as ${!value ? 'not' : ''} remote`,
      dispatch
    );

    if (result.err) {
      return { id, value: !value };
    }

    return { id, value };
  }
);

const selectAll = createAction('JOBS_SELECTALL');
const selectNone = createAction('JOBS_SELECTNONE');
const selectInvert = createAction('JOBS_SELECTINVERT');
const selectAlerts = createAction('JOBS_SELECTALERTS');
const unsync = createAction('JOBS_UNSYNC');

export {
  setOptions,
  fetchLibSources,
  fetchResults,
  clearResults,
  startFetchingResults,
  fetchCode,
  setActive,
  setEnabled,
  updateDone,
  addInstance,
  modifyInstance,
  instanceUpdateDone,
  addAlert,
  clearAlert,
  select,
  selectAll,
  selectNone,
  selectInvert,
  unsync,
  jobsAction,
  expire,
  reschedule,
  activate,
  addNew,
  selectAlerts,
  setSLAJob,
  removeSLAJob,
  setRemote,
};
