import 'whatwg-fetch';
import RESOURCES from './resources';
import * as workflowActions from './resources/workflows/actions';
import * as stepActions from './resources/steps/actions';
import * as errorActions from './resources/errors/actions';
import * as serviceActions from './resources/services/actions';
import * as jobActions from './resources/jobs/actions';
import {
  combineResourceActions,
  createResourceActions,
  createApiActions,
  fetchJson,
} from './utils';

import qs from 'qs';


export const DEFAULT_ACTIONS = {
  FETCH: url => params => {
    let newUrl = url;

    if (params) {
      const query = qs.stringify(params);
      newUrl = `${url}?${query}`;
    }

    return fetchJson(
      'GET',
      newUrl,
      params
    );
  },
  ACTION: {
    action: url => (params, id) => fetchJson(
      'PUT',
      id ? `${url}/${id}` : url,
      params
    ),
    meta: (params, id) => ({ params, id }),
  },
  BATCH_ACTION: {
    action: url => (action, ids, query = '') => fetchJson(
      'PUT',
      `${url}?action=${action}&ids=${ids}&${query}`,
    ),
    meta: (action, ids, query, params) => ({ action, ids, query, params }),
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

Object.assign(actions.jobs, jobActions.specials);

Object.keys(jobActions.delegates).forEach(a => {
  actions.jobs[a] = jobActions.delegates[a](actions);
});

export default actions;
