import 'whatwg-fetch';
import { createAction } from 'redux-actions';


import settings from '../../../../settings';


async function fetchJson(method, url, opts = {}) {
  const res = await fetch(
    url,
    Object.assign({
      method: method,
      headers: { 'Content-Type': 'application/json' }
    }, opts)
  );

  return res.json();
}


function fetchPayload(ref) {
  return fetchJson('GET', `${settings.REST_API_PREFIX}/errors/${ref}`);
}

function fetchMeta(ref) {
  return { ref };
}

const fetchErrors = createAction(
  'ERRORS_FETCH',
  fetchPayload,
  fetchMeta
);


export { fetchErrors as fetch };
