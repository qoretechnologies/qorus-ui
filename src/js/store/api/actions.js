import 'whatwg-fetch';
import RESOURCES from './resources';
import * as workflowActions from './resources/workflows/actions';
import * as stepActions from './resources/steps/actions';
import * as errorActions from './resources/errors/actions';
import * as serviceActions from './resources/services/actions';
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
  BATCH_ACTION: {
    action: url => (action, ids) => fetchJson(
      'PUT',
      `${url}?action=${action};ids=${ids}`,
    ),
    meta: (action, ids, params) => ({ action, ids, params }),
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
    createResourceActions(RESOURCES),
// TODO: Add more conveniant way to assign more actions to resource for
// example like following code
//    addResourceActions(RESOURCES, 'services', serviceActions.delegates),
  )
);

Object.keys(workflowActions.delegates).forEach(a => {
  actions.workflows[a] = workflowActions.delegates[a](actions);
});

Object.assign(actions.workflows, workflowActions.specials);

Object.assign(actions.steps, stepActions);

Object.assign(actions.errors, errorActions);

Object.keys(serviceActions.delegates).forEach(a => {
  actions.services[a] = serviceActions.delegates[a](actions);
});
Object.assign(actions.services, serviceActions.specials);

export default actions;
