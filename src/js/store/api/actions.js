import 'whatwg-fetch';
import RESOURCES from './resources';
import * as authActions from './resources/auth/actions';
import * as workflowActions from './resources/workflows/actions';
import * as stepActions from './resources/steps/actions';
import * as errorActions from './resources/errors/actions';
import * as serviceActions from './resources/services/actions';
import * as jobActions from './resources/jobs/actions';
import * as orderActions from './resources/orders/actions';
import * as optionActions from './resources/options/actions';
import * as propActions from './resources/system/props/actions';
import * as groupsActions from './resources/groups/actions';
import * as logoutActions from './resources/logout/actions';
import * as alertsActions from './resources/alerts/actions';

import {
  combineResourceActions,
  createResourceActions,
  createApiActions,
  fetchJson,
} from './utils';

import qs from 'qs';


export const DEFAULT_ACTIONS = {
  FETCH: {
    action: url => (params, id) => {
      let newUrl = url;

      if (id) {
        newUrl = `${url}/${id}`;
      }

      if (params) {
        const query = qs.stringify(params);
        newUrl = `${newUrl}?${query}`;
      }

      return fetchJson(
          'GET',
          newUrl,
          params
      );
    },
    meta: (params, id) => ({ params, id }),
  },
  ACTION: {
    action: url => (params, id, urlParams) => fetchJson(
      'PUT',
      id ? `${url}/${id}` : `${url}/${urlParams || ''}`,
      params
    ),
    meta: (params, id) => ({ params, id }),
  },
  BATCH_ACTION: {
    action: url => (action, ids, query = '', params, key = 'ids') => fetchJson(
      'PUT',
      `${url}?action=${action}&${key}=${ids}&${query}`,
    ),
    meta: (action, ids, query, params) => ({ action, ids, query, params }),
  },
  UPDATE: {
    action: url => (params, id) => fetchJson(
      'POST',
      id ? `${url}/${id}` : url,
      params
    ),
    meta: (params, id) => ({ params, id }),
  },
  REMOVE: {
    action: url => (params, id, urlParams) => fetchJson(
      'DELETE',
      id ? `${url}/${id}` : `${url}/${urlParams}`,
      params
    ),
    meta: (params, id) => ({ params, id }),
  },
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

// Object.keys(authActions).forEach(a => {
//   actions.auth[a] = authActions[a];
// });

Object.keys(workflowActions.delegates).forEach(a => {
  actions.workflows[a] = workflowActions.delegates[a](actions);
});

Object.assign(actions.workflows, workflowActions.specials);

Object.assign(actions.steps, stepActions);

Object.keys(orderActions).forEach(a => {
  actions.orders[a] = orderActions[a](actions);
});

Object.keys(propActions).forEach(a => {
  actions.props[a] = propActions[a](actions);
});

Object.keys(groupsActions).forEach(a => {
  actions.groups[a] = groupsActions[a](actions);
});

Object.assign(actions.errors, errorActions);

Object.keys(serviceActions.delegates).forEach(a => {
  actions.services[a] = serviceActions.delegates[a](actions);
});
Object.assign(actions.services, serviceActions.specials);

Object.assign(actions.jobs, jobActions.specials);

Object.keys(jobActions.delegates).forEach(a => {
  actions.jobs[a] = jobActions.delegates[a](actions);
});

Object.keys(optionActions.delegates).forEach(a => {
  actions.systemOptions[a] = optionActions.delegates[a](actions);
});

Object.keys(authActions).forEach(a => {
  actions.auth[a] = authActions[a](actions);
});

Object.keys(logoutActions).forEach(a => {
  actions.logout[a] = logoutActions[a](actions);
});

Object.keys(alertsActions).forEach(a => {
  actions.alerts[a] = alertsActions[a];
});

export default actions;
