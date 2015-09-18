import 'whatwg-fetch';
import settings from '../../settings';

const url = settings.REST_API_PREFIX;

function requestWorkflows() {
  return {
    type: 'REQUEST_WORKFLOWS'
  };
}

function receiveWorkflows(json) {
  return {
    type: 'RECEIVE_WORKFLOWS',
    payload: {
      response: json
    }
  };
}


export function fetchWorkflows() {
  return dispatch => {
    dispatch(requestWorkflows());
    return fetch(`${url}/workflows`)
      .then(req => req.json())
      .then(json => dispatch(receiveWorkflows(json)));
  };
}
