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


function savePayload(ref, err) {
  return fetchJson('POST', `${settings.REST_API_PREFIX}/errors/${ref}`, {
    body: JSON.stringify(err)
  });
}

function saveMeta(ref, err) {
  return { ref, err };
}

const saveError = createAction(
  'ERRORS_SAVE',
  savePayload,
  saveMeta
);


function updatePayload(ref, err) {
  return fetchJson(
    'PUT',
    `${settings.REST_API_PREFIX}/errors/${ref}/${err.error}`, {
      body: JSON.stringify(err)
    }
  );
}

function updateMeta(ref, err) {
  return { ref, err };
}

const updateError = createAction(
  'ERRORS_UPDATE',
  updatePayload,
  updateMeta
);


function removePayload(ref, err) {
  return fetchJson(
    'DELETE',
    `${settings.REST_API_PREFIX}/errors/${ref}/${err.error}`
  );
}

function removeMeta(ref, err) {
  return { ref, err };
}

const removeError = createAction(
  'ERRORS_REMOVE',
  removePayload,
  removeMeta
);


export {
  fetchErrors as fetch,
  saveError as save,
  updateError as update,
  removeError as remove
};