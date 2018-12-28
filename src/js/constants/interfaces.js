const INTERFACE_ICONS = {
  workflows: 'exchange',
  workflow: 'exchange',
  jobs: 'calendar',
  job: 'calendar',
  services: 'merge-links',
  service: 'merge-links',
  groups: 'group-objects',
  group: 'group-objects',
  alerts: 'warning-sign',
  alert: 'warning-sign',
  remote: 'globe',
  remotes: 'globe',
  datasource: 'join-left',
  datasources: 'join-left',
  user: 'people',
  ['user-connection']: 'people',
  users: 'people',
  sla: 'time',
  slas: 'time',
  valuemap: 'map',
  valuemaps: 'map',
  ['value maps']: 'map',
  ['value map']: 'map',
  vmap: 'map',
  vmaps: 'map',
  mapper: 'diagram-tree',
  mappers: 'diagram-tree',
  order: 'box',
  orders: 'box',
  error: 'error',
  errors: 'error',
};

const INTERFACE_ID_KEYS: Array<string> = [
  'workflowid',
  'mapperid',
  'serviceid',
  'roleid',
  'jobid',
  'alertid',
];

const INTERFACE_ID_LINKS: Object = {
  workflow: '/workflow/',
  workflows: '/workflows?paneId=',
  services: '/services?paneId=',
  job: '/job/',
  jobs: '/jobs?paneId=',
  mapper: '/mappers/',
  mappers: '/mappers/',
  role: '/system/rbac?tab=roles&search=',
  valuemap: '/system/values?paneId=',
  vmap: '/system/values?paneId=',
  valuemaps: '/system/values?paneId=',
  vmaps: '/system/values?paneId=',
  ['value maps']: '/system/values?paneId=',
  ['value map']: '/system/values?paneId=',
};

export { INTERFACE_ICONS, INTERFACE_ID_KEYS, INTERFACE_ID_LINKS };
