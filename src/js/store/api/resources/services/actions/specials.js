import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';

import { fetchJson, fetchWithNotifications, get, put } from '../../../utils';
import settings from '../../../../../settings';
import {
  updateConfigItemAction,
  updateBasicDataAction,
  fetchLoggerAction,
  addUpdateLoggerAction,
  deleteLoggerAction,
  addAppenderAction,
  deleteAppenderAction,
  updateConfigItemWsCommon,
  deleteConfigItemAction,
} from '../../../common/actions';

const updateBasicData = updateBasicDataAction('SERVICES');

function setOptionsPayload (service, name, value) {
  return fetchJson('PUT', `${settings.REST_BASE_URL}/services/${service.id}`, {
    body: JSON.stringify({
      action: 'setOptions',
      options: `${name}=${value}`,
    }),
  });
}

function setOptionsMeta (service, name, value) {
  return {
    serviceId: service.id,
    option: { name, value },
  };
}

const setOptions = createAction(
  'SERVICES_SETOPTIONS',
  setOptionsPayload,
  setOptionsMeta
);

function fetchLibSourcesPayload (id) {
  return fetchJson(
    'GET',
    `${
      settings.REST_BASE_URL
    }/services/${id}?lib_source=true&method_source=true`
  );
}

function fetchLibSourcesMeta (serviceId) {
  return { serviceId };
}

const fetchLibSources = createAction(
  'SERVICES_FETCHLIBSOURCES',
  fetchLibSourcesPayload,
  fetchLibSourcesMeta
);

function fetchMethodSourcesPayload (service) {
  return fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/services/${service.id}?method_source=true`
  );
}

function fetchMethodSourcesMeta (service) {
  return { serviceId: service.id };
}

const fetchMethodSources = createAction(
  'SERVICES_FETCHMETHODSOURCES',
  fetchMethodSourcesPayload,
  fetchMethodSourcesMeta
);

const addNew = createAction('SERVICES_ADDNEW', async id => {
  const srv = await fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/services/${id}`
  );

  return { srv };
});

const setStatus = createAction('SERVICES_SETSTATUS', events => ({ events }));

const setEnabled = createAction('SERVICES_SETENABLED', events => ({ events }));

const setAutostart = createAction('SERVICES_SETAUTOSTART', events => ({
  events,
}));

const updateDone = createAction('SERVICES_UPDATEDONE', id => ({ id }));

const addAlert = createAction('SERVICES_ADDALERT', events => ({ events }));

const clearAlert = createAction('SERVICES_CLEARALERT', events => ({ events }));

const select = createAction('SERVICES_SELECT', id => ({ id }));

const selectAll = createAction('SERVICES_SELECTALL');
const selectNone = createAction('SERVICES_SELECTNONE');
const selectInvert = createAction('SERVICES_SELECTINVERT');
const selectAlerts = createAction('SERVICES_SELECTALERTS');

const serviceAction = createAction(
  'SERVICES_ACTION',
  async (action, ids, autostart, dispatch) => {
    const id = isArray(ids) ? ids.join(',') : ids;
    const url =
      action === 'autostart'
        ? `${
          settings.REST_BASE_URL
        }/services/${id}?action=setAutostart&autostart=${!autostart}`
        : `${settings.REST_BASE_URL}/services?ids=${id}&action=${action}`;

    fetchWithNotifications(
      async () => await fetchJson('PUT', url),
      `Executing ${action} on ${id}...`,
      `${action} successfuly executed on ${id}`,
      dispatch
    );

    return {};
  }
);

const setSLAMethod = createAction(
  'SERVICES_SETMETHOD',
  (service, method, sla, dispatch): Object => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${
            settings.REST_BASE_URL
          }/slas/${sla}?action=setMethod&service=${service}&method=${method}`
        ),
      'Setting SLA...',
      'SLA successfuly set',
      dispatch
    );
  }
);

const removeSLAMethod = createAction(
  'SERVICES_REMOVEMETHOD',
  async (service, method, sla, dispatch): Object => {
    const url = `${settings.REST_BASE_URL}/slas/${sla}?`;
    const args = `action=removeMethod&service=${service}&method=${method}`;

    fetchWithNotifications(
      async () => await fetchJson('PUT', url + args),
      'Removing SLA...',
      'SLA successfuly removed',
      dispatch
    );
  }
);

const setRemote = createAction(
  'SERVICES_SETREMOTE',
  async (id, value, dispatch) => {
    fetchWithNotifications(
      async () =>
        await fetchJson(
          'PUT',
          `${settings.REST_BASE_URL}/services/${id}?action=setRemote&remote=${
            value ? 1 : 0
          }`
        ),
      `Setting service as ${!value ? 'not' : ''} remote...`,
      `Service set as ${!value ? 'not' : ''} remote`,
      dispatch
    );
  }
);

const updateConfigItem: Function = updateConfigItemAction('SERVICES');
const deleteConfigItem: Function = deleteConfigItemAction('SERVICES');
const updateConfigItemWs: Function = updateConfigItemWsCommon('SERVICES');

const processStarted = createAction('SERVICES_PROCESSSTARTED', events => ({
  events,
}));
const processStopped = createAction('SERVICES_PROCESSSTOPPED', events => ({
  events,
}));

const unsync = createAction('SERVICES_UNSYNC');

// LOGGER
const fetchLogger = fetchLoggerAction('services');
const addUpdateLogger = addUpdateLoggerAction('services');
const deleteLogger = deleteLoggerAction('services');
const addAppender = addAppenderAction('services');
const deleteAppender = deleteAppenderAction('services');

// AUTH LABELS
const fetchAuthLabels = createAction(
  'SERVICES_FETCHAUTHLABELS',
  async (id: number) => {
    const authLabels = await get(
      `${settings.REST_BASE_URL}/services/${id}/authlabels`
    );

    return { authLabels, id };
  }
);

const updateAuthLabel = createAction(
  'SERVICES_UPDATEAUTHLABEL',
  async (
    id: number,
    name: string,
    value: string,
    originalValue: string,
    dispatch: Function
  ): Object => {
    if (!dispatch) {
      return {
        name,
        value,
        id,
      };
    }

    const result: Object = await fetchWithNotifications(
      async () =>
        put(`${settings.REST_BASE_URL}/services/${id}/authlabels`, {
          body: JSON.stringify({
            [name]: value,
          }),
        }),
      `Setting ${name} to ${value}...`,
      `Successfuly set ${name} to ${value}`,
      dispatch
    );

    if (result.err) {
      return {
        name,
        value: originalValue,
        id,
      };
    }

    return {
      name,
      value,
      id,
    };
  }
);

export {
  setOptions,
  fetchLibSources,
  fetchMethodSources,
  setStatus,
  setEnabled,
  setAutostart,
  updateDone,
  addAlert,
  clearAlert,
  select,
  selectAll,
  selectNone,
  selectInvert,
  serviceAction,
  unsync,
  addNew,
  selectAlerts,
  setSLAMethod,
  removeSLAMethod,
  setRemote,
  updateConfigItem,
  updateConfigItemWs,
  processStarted,
  processStopped,
  updateBasicData,
  fetchLogger,
  addUpdateLogger,
  deleteLogger,
  addAppender,
  deleteAppender,
  fetchAuthLabels,
  updateAuthLabel,
  deleteConfigItem,
};
