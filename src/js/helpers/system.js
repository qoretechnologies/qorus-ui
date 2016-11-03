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
    suffix: '/list/All',
  },
  SERVICE: {
    resource: 'services',
    uses: 'id',
  },
  JOB: {
    resource: 'job',
    uses: 'id',
  },
  'USER-CONNECTION': {
    resource: 'system/remote/user',
    uses: 'name',
  },
  REMOTE: {
    resource: 'system/remote/qorus',
    uses: 'name',
  },
  GROUP: {
    resource: 'groups',
    uses: 'name',
  },
  ORDER: {
    resource: 'order',
    uses: 'id',
  },
  DATASOURCE: {
    resource: 'system/remote/datasources',
    uses: 'name',
  },
};

const getAlertObjectLink: Function = (type: string, data: Object): string => {
  const res = alertTypeToResource[type];

  return `/${res.resource}/${data[res.uses]}${res.suffix || ''}`;
};

export {
  statusHealth,
  utf8ToB64,
  getAlertObjectLink,
};
