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
    resource: 'workflow',
    uses: 'id',
    suffix: '/list?filter=All',
  },
  SERVICE: {
    resource: 'services',
    uses: 'id',
    query: 'paneId',
  },
  JOB: {
    resource: 'job',
    uses: 'id',
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

const getAlertObjectLink: Function = (type: string, data: Object): string => {
  const res = alertTypeToResource[type];

  // eslint-disable-next-line
  return `/${res.resource}${res.query ? `?${res.query}=${data[res.uses]}` : `/${data[res.uses]}`}${res.suffix || ''}`;
};

export {
  statusHealth,
  utf8ToB64,
  getAlertObjectLink,
};
