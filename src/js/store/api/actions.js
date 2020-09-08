import 'whatwg-fetch';

import qs from 'qs';

import RESOURCES from './resources';
import * as alertsActions from './resources/alerts/actions';
import * as clientsActions from './resources/clients/actions';
import * as currentUserActions from './resources/currentUser/actions';
import * as errorActions from './resources/errors/actions';
import * as extensionsActions from './resources/extensions/actions';
import * as fsmsActions from './resources/fsms/actions';
import * as groupsActions from './resources/groups/actions';
import * as healthActions from './resources/health/actions';
import * as instancesActions from './resources/instances/actions';
import * as jobActions from './resources/jobs/actions';
import * as logoutActions from './resources/logout/actions';
import * as optionActions from './resources/options/actions';
import * as orderErrorsActions from './resources/orderErrors/actions';
import * as orderActions from './resources/orders/actions';
import * as permsActions from './resources/perms/actions';
import * as pipelinesActions from './resources/pipelines/actions';
import * as propActions from './resources/props/actions';
import * as releasesActions from './resources/releases/actions';
import * as remoteActions from './resources/remotes/actions';
import * as rolesActions from './resources/roles/actions';
import * as serviceActions from './resources/services/actions';
import * as slasActions from './resources/slas/actions';
import * as slaEventsActions from './resources/slas/events/actions';
import * as slaPerfActions from './resources/slas/perf/actions';
import * as sqlcacheActions from './resources/sqlcache/actions';
import * as stepActions from './resources/steps/actions';
import * as systemActions from './resources/system/actions';
import * as usersActions from './resources/users/actions';
import * as valuemapsActions from './resources/valuemaps/actions';
import * as workflowActions from './resources/workflows/actions';
import {
  combineResourceActions, createApiActions, createResourceActions, fetchJson
} from './utils';

export const DEFAULT_ACTIONS = {
  FETCH: {
    action: (url) => (params, id) => {
      let newUrl = url;

      if (id) {
        newUrl = `${url}/${id}`;
      }

      if (params) {
        const query = qs.stringify(params);
        newUrl = `${newUrl}?${query}`;
      }

      return fetchJson('GET', newUrl, params);
    },
    meta: (params, id) => ({ params, id }),
  },
  ACTION: {
    action: (url) => (params, id, urlParams) =>
      fetchJson(
        'PUT',
        id ? `${url}/${id}` : `${url}/${urlParams || ''}`,
        params
      ),
    meta: (params, id) => ({ params, id }),
  },
  BATCH_ACTION: {
    action: (url) => (action, ids, query = '', params, key = 'ids') =>
      fetchJson('PUT', `${url}?action=${action}&${key}=${ids}&${query}`),
    meta: (action, ids, query, params) => ({ action, ids, query, params }),
  },
  UPDATE: {
    action: (url) => (params, id) =>
      fetchJson('POST', id ? `${url}/${id}` : url, params),
    meta: (params, id) => ({ params, id }),
  },
  REMOVE: {
    action: (url) => (params, id, urlParams) =>
      fetchJson('DELETE', id ? `${url}/${id}` : `${url}/${urlParams}`, params),
    meta: (params, id) => ({ params, id }),
  },
};

const actions = createApiActions(
  combineResourceActions(
    createResourceActions(RESOURCES, DEFAULT_ACTIONS),
    createResourceActions(RESOURCES)
  )
);

Object.assign(actions.workflows, workflowActions.specials);

Object.assign(actions.remotes, remoteActions);

Object.assign(actions.users, usersActions);

Object.assign(actions.instances, instancesActions);

Object.assign(actions.currentUser, currentUserActions);

Object.assign(actions.roles, rolesActions);

Object.assign(actions.perms, permsActions);

Object.assign(actions.steps, stepActions);

Object.assign(actions.props, propActions);

Object.assign(actions.valuemaps, valuemapsActions);

Object.assign(actions.health, healthActions);

Object.assign(actions.extensions, extensionsActions);

Object.assign(actions.orderErrors, orderErrorsActions);

Object.assign(actions.releases, releasesActions);

Object.assign(actions.system, systemActions);

Object.assign(actions.slas, slasActions);

Object.assign(actions.slaevents, slaEventsActions);

Object.assign(actions.slaperf, slaPerfActions);

Object.assign(actions.orders, orderActions.specials);

Object.assign(actions.groups, groupsActions);

Object.assign(actions.errors, errorActions);

Object.assign(actions.systemOptions, optionActions);

Object.assign(actions.clients, clientsActions);

Object.assign(actions.fsms, fsmsActions);

Object.assign(actions.pipelines, pipelinesActions);

Object.keys(serviceActions.delegates).forEach((a) => {
  actions.services[a] = serviceActions.delegates[a](actions);
});
Object.assign(actions.services, serviceActions.specials);

actions.jobs = { ...actions.jobs, ...jobActions.specials };

Object.assign(actions.logout, logoutActions);

Object.keys(alertsActions).forEach((a) => {
  actions.alerts[a] = alertsActions[a];
});

Object.keys(sqlcacheActions).forEach((a) => {
  actions.sqlcache[a] = sqlcacheActions[a];
});

actions.system.withDispatchInjected = (action: Function, ...args) => (
  dispatch: Function
) => dispatch(action(...args, dispatch));

actions.system.withDispatchOptimisticInjected = (action: Function, ...args) => (
  dispatch: Function
) => {
  dispatch(action(...args));
  return dispatch(action(...args, dispatch));
};

export default actions;
