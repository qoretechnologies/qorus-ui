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
    `${settings.REST_BASE_URL}/services/${service.id}?lib_source=true`
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


export { setOptions, fetchLibSources };
