import 'whatwg-fetch';
import { createAction } from 'redux-actions';


import { fetchJson } from '../../utils';
import settings from '../../../../settings';


function fetchPayload(id) {
  return fetchJson('GET', `${settings.REST_API_PREFIX}/steps/${id}`);
}

function fetchMeta(id) {
  return { id };
}

const fetchErrors = createAction(
  'STEPS_FETCH',
  fetchPayload,
  fetchMeta
);


export {
  fetchErrors as fetch,
};
