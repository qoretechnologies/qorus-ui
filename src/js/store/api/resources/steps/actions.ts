import 'whatwg-fetch';
import { createAction } from 'redux-actions';


import { fetchJson } from '../../utils';
import settings from '../../../../settings';


function fetchPayload(id) {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
  return fetchJson('GET', `${settings.REST_BASE_URL}/steps/${id}`);
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
