import { createAction } from 'redux-actions';


import { fetchJson } from '../../../utils';
import settings from '../../../../../settings';


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


function fetchLibSourcesPayload(service) {
  return fetchJson(
    'GET',
    `${settings.REST_BASE_URL}/services/${service.id}?lib_source=true&method_source=true`
  );
}

function fetchLibSourcesMeta(service) {
  return { serviceId: service.id };
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

export {
  setOptions,
  fetchLibSources,
  fetchMethodSources,
  setStatus,
  setEnabled,
  updateDone,
  addAlert,
  clearAlert,
};
