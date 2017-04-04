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
import * as propActions from './resources/props/actions';
import * as groupsActions from './resources/groups/actions';
import * as logoutActions from './resources/logout/actions';
import * as alertsActions from './resources/alerts/actions';
import * as remoteActions from './resources/remotes/actions';
import * as sqlcacheActions from './resources/sqlcache/actions';
import * as usersActions from './resources/users/actions';
import * as rolesActions from './resources/roles/actions';
import * as permsActions from './resources/perms/actions';
import * as currentUserActions from './resources/currentUser/actions';
import * as valuemapsActions from './resources/valuemaps/actions';
import * as extensionsActions from './resources/extensions/actions';
import * as orderErrorsActions from './resources/orderErrors/actions';

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
  )
);

Object.assign(actions.workflows, workflowActions.specials);

Object.assign(actions.remotes, remoteActions);

Object.assign(actions.users, usersActions);

Object.assign(actions.currentUser, currentUserActions);

Object.assign(actions.roles, rolesActions);

Object.assign(actions.perms, permsActions);

Object.assign(actions.steps, stepActions);

Object.assign(actions.props, propActions);

Object.assign(actions.valuemaps, valuemapsActions);

Object.assign(actions.extensions, extensionsActions);

Object.assign(actions.orderErrors, orderErrorsActions);

Object.keys(orderActions.delegates).forEach(a => {
  actions.orders[a] = orderActions.delegates[a](actions);
});
Object.assign(actions.orders, orderActions.specials);

Object.assign(actions.groups, groupsActions);

Object.assign(actions.errors, errorActions);

Object.keys(serviceActions.delegates).forEach(a => {
  actions.services[a] = serviceActions.delegates[a](actions);
});
Object.assign(actions.services, serviceActions.specials);

actions.jobs = { ...actions.jobs, ...jobActions.specials };

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

Object.keys(sqlcacheActions).forEach(a => {
  actions.sqlcache[a] = sqlcacheActions[a];
});

export default actions;
