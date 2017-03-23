import { createAction } from 'redux-actions';
import isArray from 'lodash/isArray';

import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';
import { error } from '../../../../ui/bubbles/actions';

function setOptionsPayload(service, name, value) {
  return fetchJson(
    'PUT',
    `${settings.REST_BASE_URL}/services/${service.id}`,
    {
      body: JSON.stringify({
        action: 'setOptions',
        options: `${name}=${value}`,
      }),
    }
  );
}

function setOptionsMeta(service, name, value) {
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


function fetchLibSourcesPayload(id) {
  return fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/services/${id}?lib_source=true&method_source=true`
  );
}

function fetchLibSourcesMeta(serviceId) {
  return { serviceId };
}

const fetchLibSources = createAction(
  'SERVICES_FETCHLIBSOURCES',
  fetchLibSourcesPayload,
  fetchLibSourcesMeta
);

function fetchMethodSourcesPayload(service) {
  return fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/services/${service.id}?method_source=true`
  );
}

function fetchMethodSourcesMeta(service) {
  return { serviceId: service.id };
}

const fetchMethodSources = createAction(
  'SERVICES_FETCHMETHODSOURCES',
  fetchMethodSourcesPayload,
  fetchMethodSourcesMeta
);

const setStatus = createAction(
  'SERVICES_SETSTATUS',
  (events) => ({ events })
);

const setEnabled = createAction(
  'SERVICES_SETENABLED',
  (events) => ({ events })
);

const setAutostart = createAction(
  'SERVICES_SETAUTOSTART',
  (events) => ({ events })
);

const updateDone = createAction(
  'SERVICES_UPDATEDONE',
  (id) => ({ id })
);

const addAlert = createAction(
  'SERVICES_ADDALERT',
  (events) => ({ events })
);

const clearAlert = createAction(
  'SERVICES_CLEARALERT',
  (events) => ({ events })
);

const select = createAction(
  'SERVICES_SELECT',
  (id) => ({ id })
);

const selectAll = createAction('SERVICES_SELECTALL');
const selectNone = createAction('SERVICES_SELECTNONE');
const selectInvert = createAction('SERVICES_SELECTINVERT');

const serviceActionCall = createAction(
  'SERVICES_ACTION',
  async (action, ids, autostart, dispatch) => {
    const id = isArray(ids) ? ids.join(',') : ids;
    const url = action === 'autostart' ?
      `${settings.REST_BASE_URL}/services/${id}?action=setAutostart&autostart=${!autostart}` :
      `${settings.REST_BASE_URL}/services?ids=${id}&action=${action}`;
    const result = await fetchJson('PUT', url, null, true);

    if (result.err) {
      dispatch(error(result.desc));
    }

    return {};
  }
);

const serviceAction = (action, ids, autostart) => dispatch => {
  serviceActionCall(action, ids, autostart, dispatch);
};

const unsync = createAction('SERVICES_UNSYNC');

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
};
