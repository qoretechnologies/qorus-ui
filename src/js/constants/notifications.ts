const NOTIFICATION_TYPES: Array<string> = [
  'workflows',
  'services',
  'jobs',
  'groups',
  'remotes',
  'users',
  'datasources',
  'orders',
];

const ALERT_NOTIFICATION_TYPES: Object = {
  WORKFLOW: 'workflows',
  SERVICE: 'services',
  JOB: 'jobs',
  GROUP: 'groups',
  REMOTE: 'remotes',
  'USER-CONNECTION': 'users',
  DATASOURCE: 'datasources',
  ORDER: 'orders',
};

export { NOTIFICATION_TYPES, ALERT_NOTIFICATION_TYPES };
