/* @flow */
import classNames from 'classnames';

const statusHealth: Function = (health: string): string => (
  classNames({
    danger: health === 'RED',
    success: health === 'GREEN',
    warning: health === 'YELLOW' || health === 'UNKNOWN' || health === 'UNREACHABLE',
  })
);

const utf8ToB64: Function = (str: string): string => (
  window.btoa(encodeURIComponent(str))
);

const alertTypeToResource: Object = {
  WORKFLOW: {
    resource: 'workflows',
    uses: 'id',
    query: 'paneId',
  },
  SERVICE: {
    resource: 'services',
    uses: 'id',
    query: 'paneId',
  },
  JOB: {
    resource: 'jobs',
    uses: 'id',
    query: 'paneId',
  },
  'USER-CONNECTION': {
    resource: 'system/remote/user',
    uses: 'name',
    query: 'paneId',
  },
  REMOTE: {
    resource: 'system/remote/qorus',
    uses: 'name',
    query: 'paneId',
  },
  GROUP: {
    resource: 'groups',
    uses: 'name',
    query: 'group',
  },
  ORDER: {
    resource: 'order',
    uses: 'id',
    suffix: '/19700101',
  },
  DATASOURCE: {
    resource: 'system/remote/datasources',
    uses: 'name',
    query: 'paneId',
  },
};

const interfaceTypeToResource: Object = {
  WORKFLOW: {
    resource: 'workflows',
    uses: 'workflowid',
    query: 'paneId',
  },
  SERVICE: {
    resource: 'services',
    uses: 'serviceid',
    query: 'paneId',
  },
  JOB: {
    resource: 'jobs',
    uses: 'jobid',
    query: 'paneId',
  },
  user: {
    resource: 'services',
    uses: 'serviceid',
    query: 'paneId',
  },
};

const getAlertObjectLink: Function = (type: string, data: Object): string => {
  const res = alertTypeToResource[type];

  // eslint-disable-next-line
  return `/${res.resource}${res.query ? `?${res.query}=${data[res.uses]}` : `/${data[res.uses]}`}${res.suffix || ''}`;
};

const getDependencyObjectLink: Function = (type: string, data: Object): string => {
  const res = interfaceTypeToResource[type];

  // eslint-disable-next-line
  return `/${res.resource}${res.query ? `?${res.query}=${data[res.uses]}` : `/${data[res.uses]}`}`;
};

const typeToString: Function = (val: any): any => {
  if (typeof val === 'undefined') {
    return 'undefined';
  } else if (val === null) {
    return 'null';
  } else if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }

  return val;
};

export {
  statusHealth,
  utf8ToB64,
  getAlertObjectLink,
  getDependencyObjectLink,
  typeToString,
};
