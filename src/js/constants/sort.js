import keyMirror from 'keymirror';
import { ORDER_STATES_ARRAY } from './orders';

export default keyMirror({
  CHANGE_SORT: null,
  INIT_SORT: null,
});

export const sortDefaults = {
  orders: {
    sortBy: 'started',
    sortByKey: { direction: -1, ignoreCase: true },
    historySortBy: 'workflowstatus',
    historySortByKey: { direction: 1, ignoreCase: true },
  },
  instances: {
    sortBy: 'started',
    sortByKey: { direction: -1, ignoreCase: true },
    historySortBy: 'jobstatus',
    historySortByKey: { direction: 1, ignoreCase: true },
  },
  orderErrors: {
    sortBy: 'id',
    sortByKey: { direction: -1, ignoreCase: true },
  },
  alerts: {
    sortBy: 'when',
    sortByKey: { ignoreCase: true, direction: -1 },
    historySortBy: 'alert',
    historySortByKey: { ignoreCase: true, direction: -1 },
  },
  globalErrors: {
    sortBy: 'error',
    sortByKey: { direction: 1, ignoreCase: true },
    historySortBy: 'description',
    historySortByKey: { direction: 1, ignoreCase: true },
  },
  workflowErrors: {
    sortBy: 'error',
    sortByKey: { direction: 1, ignoreCase: true },
    historySortBy: 'description',
    historySortByKey: { direction: 1, ignoreCase: true },
  },
  groups: {
    sortBy: 'enabled',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  jobs: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'version',
    historySortByKey: { ignoreCase: true, direction: -1 },
  },
  options: {
    sortBy: 'status',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  services: {
    sortBy: 'type',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  workflows: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'version',
    historySortByKey: { ignoreCase: true, direction: -1 },
  },
  jobResults: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
    historySortBy: 'modified',
    historySortByKey: { ignoreCase: true, direction: -1 },
  },
  rbacUsers: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  rbacRoles: {
    sortBy: 'role',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  rbacPerms: {
    sortBy: 'permission_type',
    sortByKey: { ignoreCase: true, direction: -1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  valuemaps: {
    sortBy: 'created',
    sortByKey: { ignoreCase: true, direction: -1 },
    historySortBy: 'name',
    historySortByKey: { ignoreCase: true, direction: 1 },
  },
  valuemapsCompact: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  valuemapsValues: {
    sortBy: 'enabled',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  remote: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  mappers: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  slas: {
    sortBy: 'slaid',
    sortByKey: { ignoreCase: true, direction: -1 },
  },
  slaevents: {
    sortBy: 'sla_eventid',
    sortByKey: { ignoreCase: true, direction: -1 },
  },
  slamethods: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  nodes: {
    sortBy: 'client_id',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  orderStatsModal: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  orderSLAModal: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  properties: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  sqlcache: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
  configItems: {
    sortBy: 'name',
    sortByKey: { ignoreCase: true, direction: 1 },
  },
};

export const sortKeys = {
  workflows: {
    Author: 'author',
    Autostart: 'autostart',
    Created: 'created',
    Deprecated: 'deprecated',
    Enabled: 'enabled',
    ['Exec Count']: 'exec_count',
    Modified: 'modified',
    Name: 'name',
    Remote: 'remote',
    ['SLA Threshold']: 'sla_threshold',
    Version: 'version',
    ID: 'id',
    ...ORDER_STATES_ARRAY.reduce(
      (states: Object, state: string): Object => ({
        ...states,
        [state]: state,
      }),
      {}
    ),
  },
};
