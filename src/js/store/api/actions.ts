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

      // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      return fetchJson('GET', newUrl, params);
    },
    meta: (params, id) => ({ params, id }),
  },
  ACTION: {
    action: (url) => (params, id, urlParams) =>
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      fetchJson(
        'PUT',
        id ? `${url}/${id}` : `${url}/${urlParams || ''}`,
        params
      ),
    meta: (params, id) => ({ params, id }),
  },
  BATCH_ACTION: {
    action: (url) => (action, ids, query = '', params, key = 'ids') =>
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 2.
      fetchJson('PUT', `${url}?action=${action}&${key}=${ids}&${query}`),
    meta: (action, ids, query, params) => ({ action, ids, query, params }),
  },
  UPDATE: {
    action: (url) => (params, id) =>
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      fetchJson('POST', id ? `${url}/${id}` : url, params),
    meta: (params, id) => ({ params, id }),
  },
  REMOVE: {
    action: (url) => (params, id, urlParams) =>
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 3.
      fetchJson('DELETE', id ? `${url}/${id}` : `${url}/${urlParams}`, params),
    meta: (params, id) => ({ params, id }),
  },
};

const actions = createApiActions(
  combineResourceActions(
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ FETCH: { action: (url: any) =>... Remove this comment to see the full error message
    createResourceActions(RESOURCES, DEFAULT_ACTIONS),
    createResourceActions(RESOURCES)
  )
);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
Object.assign(actions.workflows, workflowActions.specials);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
Object.assign(actions.remotes, remoteActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'users' does not exist on type '{}'.
Object.assign(actions.users, usersActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'instances' does not exist on type '{}'.
Object.assign(actions.instances, instancesActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
Object.assign(actions.currentUser, currentUserActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'roles' does not exist on type '{}'.
Object.assign(actions.roles, rolesActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'perms' does not exist on type '{}'.
Object.assign(actions.perms, permsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'steps' does not exist on type '{}'.
Object.assign(actions.steps, stepActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'props' does not exist on type '{}'.
Object.assign(actions.props, propActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'valuemaps' does not exist on type '{}'.
Object.assign(actions.valuemaps, valuemapsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'health' does not exist on type '{}'.
Object.assign(actions.health, healthActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'extensions' does not exist on type '{}'.
Object.assign(actions.extensions, extensionsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'orderErrors' does not exist on type '{}'... Remove this comment to see the full error message
Object.assign(actions.orderErrors, orderErrorsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'releases' does not exist on type '{}'.
Object.assign(actions.releases, releasesActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
Object.assign(actions.system, systemActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'slas' does not exist on type '{}'.
Object.assign(actions.slas, slasActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'slaevents' does not exist on type '{}'.
Object.assign(actions.slaevents, slaEventsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'slaperf' does not exist on type '{}'.
Object.assign(actions.slaperf, slaPerfActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
Object.assign(actions.orders, orderActions.specials);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type '{}'.
Object.assign(actions.groups, groupsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'errors' does not exist on type '{}'.
Object.assign(actions.errors, errorActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'systemOptions' does not exist on type '{... Remove this comment to see the full error message
Object.assign(actions.systemOptions, optionActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type '{}'.
Object.assign(actions.clients, clientsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'fsms' does not exist on type '{}'.
Object.assign(actions.fsms, fsmsActions);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'pipelines' does not exist on type '{}'.
Object.assign(actions.pipelines, pipelinesActions);

Object.keys(serviceActions.delegates).forEach((a) => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
  actions.services[a] = serviceActions.delegates[a](actions);
});
// @ts-expect-error ts-migrate(2339) FIXME: Property 'services' does not exist on type '{}'.
Object.assign(actions.services, serviceActions.specials);

// @ts-expect-error ts-migrate(2339) FIXME: Property 'jobs' does not exist on type '{}'.
actions.jobs = { ...actions.jobs, ...jobActions.specials };

// @ts-expect-error ts-migrate(2339) FIXME: Property 'logout' does not exist on type '{}'.
Object.assign(actions.logout, logoutActions);

Object.keys(alertsActions).forEach((a) => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type '{}'.
  actions.alerts[a] = alertsActions[a];
});

Object.keys(sqlcacheActions).forEach((a) => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'sqlcache' does not exist on type '{}'.
  actions.sqlcache[a] = sqlcacheActions[a];
});

// @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
actions.system.withDispatchInjected = (action: Function, ...args) => (
  dispatch: Function
) => dispatch(action(...args, dispatch));

// @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
actions.system.withDispatchOptimisticInjected = (action: Function, ...args) => (
  dispatch: Function
) => {
  dispatch(action(...args));
  return dispatch(action(...args, dispatch));
};

export default actions;
