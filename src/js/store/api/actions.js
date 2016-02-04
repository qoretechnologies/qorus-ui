import 'whatwg-fetch';
import RESOURCES from './resources';
import * as workflowActions from './resources/workflows/actions';
import * as errorActions from './resources/errors/actions';
import {
  combineResourceActions,
  createResourceActions,
  createApiActions,
  fetchJson,
} from './utils';


export const DEFAULT_ACTIONS = {
  FETCH: url => params => fetchJson(
    'GET',
    url,
    params
  ),
  ACTION: {
    action: url => (params, id) => fetchJson(
      'PUT',
      id ? `${url}/${id}` : url,
      params
    ),
    meta: (params, id) => ({ params, id }),
  },
  UPDATE: url => (params, id) => fetchJson(
    'POST',
    id ? `${url}/${id}` : url,
    params
  ),
};


const actions = createApiActions(
  combineResourceActions(
    createResourceActions(RESOURCES, DEFAULT_ACTIONS),
    createResourceActions(RESOURCES)
  )
);

Object.keys(workflowActions.delegates).forEach(a => {
  actions.workflows[a] = workflowActions.delegates[a](actions);
});
Object.assign(actions.workflows, workflowActions.specials);

Object.assign(actions.errors, errorActions);


export default actions;
