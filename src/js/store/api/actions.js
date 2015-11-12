import 'whatwg-fetch';
import RESOURCES from './resources';
import { setWorkflowAutostart } from './resources/workflows/actions';
import {
  combineResourceActions,
  createResourceActions,
  createApiActions }
from './utils';

export const DEFAULT_ACTIONS = {
  FETCH: (url) => async (params) => {
    const result = await fetch(url, params);
    return result.json();
  },
  ACTION: {
    action: (url) => async (params, id) => {
      const fetchUrl = (id) ? `${url}/${id}` : url;
      const result = await fetch(fetchUrl, Object.assign({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT'
      }, params));
      return result.json();
    },
    meta: (params, id) => { return { params, id }; }
  },
  UPDATE: (url) => async (params, id) => {
    const fetchUrl = (id) ? `${url}/${id}` : url;
    const result = await fetch(fetchUrl, params);
    return result.json();
  }
};


const actions = createApiActions(
  combineResourceActions(
    createResourceActions(RESOURCES, DEFAULT_ACTIONS),
    createResourceActions(RESOURCES)
  )
);
actions.workflows.setAutostart = setWorkflowAutostart(actions);

export default actions;
