import isArray from 'lodash/isArray';
import queryString from 'qs';
import { createAction } from 'redux-actions';
import settings from '../../../../../settings';
import {
  addAppenderAction,
  addUpdateLoggerAction,
  deleteAppenderAction,
  deleteConfigItemAction,
  deleteLoggerAction,
  editAppenderAction,
  fetchLoggerAction,
  updateBasicDataAction,
  updateConfigItemAction,
  updateConfigItemWsCommon,
} from '../../../common/actions';
import { fetchData, fetchJson, fetchText, fetchWithNotifications } from '../../../utils';

const jobsUrl = `${settings.REST_BASE_URL}/jobs`;

const updateBasicData = updateBasicDataAction('JOBS');

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

  // @ts-ignore ts-migrate(2554) FIXME: Expected 6 arguments, but got 3.
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

const setOptionsAction = createAction('JOBS_SETOPTIONS', setOptionsPayload, setOptionsMeta);

/**
 * Sends real and optimistic actions to set option
 * @param {Object} model model that should be updated
 * @param {Object} opt updated option
 */
const setOptions = (model, opt) => (dispatch) => {
  dispatch(setOptionsAction(model, opt, true));
  dispatch(setOptionsAction(model, opt));
};

const fetchLibSourcesPayload = (baseUrl) => (model) =>
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  fetchJson('GET', `${baseUrl}/${model.id}?lib_source=true&method_source=true`);

function fetchLibSourcesMeta(model) {
  return { modelId: model.id };
}

const fetchLibSources = createAction(
  'JOBS_FETCHLIBSOURCES',
  fetchLibSourcesPayload(jobsUrl),
  fetchLibSourcesMeta
);

const addNew = createAction('JOBS_ADDNEW', async (id) => {
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  const job = await fetchJson('GET', `${settings.REST_BASE_URL}/jobs/${id}`);

  return { job };
});

const fetchResultsPayload =
  (baseUrl) =>
  (model, query, offset = 0, limit = 50) =>
    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
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

const fetchResults =
  (...args) =>
  (dispatch) => {
    dispatch(startFetchingResults(...args));
    dispatch(fetchResultsCall(...args));
  };

const clearResults = createAction(
  'JOBS_CLEARRESULTS',
  () => ({}),
  ({ id: modelId }) => ({ modelId })
);

const fetchCodePayload = async (job) => ({
  // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  code: await fetchText('GET', `${settings.REST_BASE_URL}/jobs/${job.id}/code`),
});
const fetchCodeMeta = (job) => ({ job });

const fetchCode = createAction('JOBS_FETCHCODE', fetchCodePayload, fetchCodeMeta);
const setActive = createAction('JOBS_SETACTIVE', (events) => ({ events }));

const setEnabled = createAction('JOBS_SETENABLED', (events) => ({ events }));

const updateDone = createAction('JOBS_UPDATEDONE', (id) => ({ id }));

const instanceUpdateDone = createAction('JOBS_INSTANCEUPDATEDONE', (jobid, id) => ({ jobid, id }));

const addInstance = createAction('JOBS_ADDINSTANCE', (events) => ({ events }));

const modifyInstance = createAction('JOBS_MODIFYINSTANCE', (events) => ({
  events,
}));

const addAlert = createAction('JOBS_ADDALERT', (events) => ({ events }));

const clearAlert = createAction('JOBS_CLEARALERT', (events) => ({ events }));

const select = createAction('JOBS_SELECT', (id) => ({ id }));

const jobsAction = createAction('JOBS_ACTION', async (action, ids, dispatch) => {
  const id = isArray(ids) ? ids.join(',') : ids;
  const url = `${settings.REST_BASE_URL}/jobs?ids=${id}&action=${action}`;

  fetchWithNotifications(
    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
    async () => await fetchJson('PUT', url),
    `Executing ${action} on job(s) ${id}...`,
    `${action} successfuly executed on job(s) ${ids}`,
    dispatch
  );

  return {};
});

const expire = createAction('JOBS_EXPIRE', async (id, date, onFinish, dispatch) => {
  fetchWithNotifications(
    async () => {
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
      const res: any = await fetchJson(
        'PUT',
        `${settings.REST_BASE_URL}/jobs/${id}?action=setExpiry&date=${date}`
      );

      if (onFinish) onFinish();

      return res;
    },
    `Executing expire on ${id}...`,
    `Expire change executed on ${id}`,
    dispatch
  );
});

const reschedule = createAction(
  'JOBS_RESCHEDULE',
  async (id, { minute, hour, day, month, wday }, dispatch) => {
    const cron = `${minute} ${hour} ${day} ${month} ${wday}`;
    const url = `${settings.REST_BASE_URL}/jobs/${id}?action=schedule&schedule=${cron}`;

    fetchWithNotifications(
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
      async () => await fetchJson('PUT', url),
      `Rescheduling job ${id}...`,
      `Job ${id} rescheduled`,
      dispatch
    );
  }
);

const activate = createAction('JOBS_ACTIVATE', (id, active, dispatch) => {
  const url = `${settings.REST_BASE_URL}/jobs/${id}?action=setActive&active=${!active}`;

  fetchWithNotifications(
    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
    async () => await fetchJson('PUT', url),
    `Activating job ${id}...`,
    `Job ${id} activated`,
    dispatch
  );
});

const run = createAction('JOBS_RUN', (id, dispatch) => {
  const url = `${settings.REST_BASE_URL}/jobs/${id}?action=run`;

  fetchWithNotifications(
    // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
    async () => await fetchJson('PUT', url),
    `Running job ${id}...`,
    `Job ${id} ran`,
    dispatch
  );
});

const setSLAJob = createAction(
  'JOBS_SETSLAJOB',
  // @ts-ignore ts-migrate(2355) FIXME: A function whose declared type is neither 'void' n... Remove this comment to see the full error message
  (job, sla, dispatch): any => {
    fetchWithNotifications(
      async () =>
        // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
        await fetchJson('PUT', `${settings.REST_BASE_URL}/slas/${sla}?action=setJob&job=${job}`),
      `Setting SLA for job ${job}...`,
      `SLA for job ${job} set`,
      dispatch
    );
  }
);

const removeSLAJob = createAction(
  'JOBS_REMOVESLAJOB',
  // @ts-ignore ts-migrate(2355) FIXME: A function whose declared type is neither 'void' n... Remove this comment to see the full error message
  (job, sla, dispatch): any => {
    const url = `${settings.REST_BASE_URL}/slas/${sla}?`;
    const args = `action=removeJob&job=${job}`;

    fetchWithNotifications(
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
      async () => await fetchJson('PUT', url + args),
      `Removing SLA from job ${job}`,
      `SLA removed from job ${job}`,
      dispatch
    );
  }
);

const setRemote = createAction('JOBS_SETREMOTE', async (id, value, dispatch) => {
  fetchWithNotifications(
    async () =>
      // @ts-ignore ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      await fetchJson('PUT', `${settings.REST_BASE_URL}/jobs/${id}/setRemote`, {
        body: JSON.stringify({
          remote: value,
        }),
      }),
    `Setting job ${id} as ${!value ? 'not' : ''} remote...`,
    `Set job ${id} as ${!value ? 'not' : ''} remote`,
    dispatch
  );
});

const updateConfigItem: Function = updateConfigItemAction('JOBS');
const deleteConfigItem: Function = deleteConfigItemAction('JOBS');
const updateConfigItemWs = updateConfigItemWsCommon('JOBS');

const processStarted = createAction('JOBS_PROCESSSTARTED', (events) => ({
  events,
}));

const processStopped = createAction('JOBS_PROCESSSTOPPED', (events) => ({
  events,
}));

const selectAll = createAction('JOBS_SELECTALL');
const selectNone = createAction('JOBS_SELECTNONE');
const selectInvert = createAction('JOBS_SELECTINVERT');
const selectAlerts = createAction('JOBS_SELECTALERTS');
const unsync = createAction('JOBS_UNSYNC');
const fetchLogger = fetchLoggerAction('jobs');
const addUpdateLogger = addUpdateLoggerAction('jobs');
const deleteLogger = deleteLoggerAction('jobs');
const addAppender = addAppenderAction('jobs');
const editAppender = editAppenderAction('jobs');
const deleteAppender = deleteAppenderAction('jobs');

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
  updateConfigItem,
  updateConfigItemWs,
  processStarted,
  processStopped,
  updateBasicData,
  run,
  fetchLogger,
  addUpdateLogger,
  deleteLogger,
  addAppender,
  deleteAppender,
  deleteConfigItem,
  editAppender,
};
