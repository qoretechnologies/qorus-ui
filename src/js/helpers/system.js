/* @flow */
import classNames from 'classnames';
import round from 'lodash/round';

const statusHealth: Function = (health: string): string =>
  classNames({
    danger: health === 'RED' || health === 'ERROR',
    success: health === 'GREEN',
    warning:
      health === 'YELLOW' || health === 'UNKNOWN' || health === 'UNREACHABLE',
  });

const utf8ToB64: Function = (str: string): string =>
  window.btoa(encodeURIComponent(str));

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
  return `/${res.resource}${
    res.query ? `?${res.query}=${data[res.uses]}` : `/${data[res.uses]}`
  }${res.suffix || ''}`;
};

const getDependencyObjectLink: Function = (
  type: string,
  data: Object
): string => {
  const res = interfaceTypeToResource[type];

  // eslint-disable-next-line
  return `/${res.resource}${
    res.query ? `?${res.query}=${data[res.uses]}` : `/${data[res.uses]}`
  }`;
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

const getProcessObjectLink: Function = (process: Object) => {
  switch (process.type) {
    case 'qdsp':
      return `/system/remote/datasources?paneId=${process.client_id}`;
    case 'qwf':
      return `/workflows?paneId=${process.wfid}&paneTab=details`;
    case 'qsvc':
      return `/services?paneId=${process.svcid}&paneTab=details`;
    default:
      return '#';
  }
};

const calculateMemory: Function = (
  memory: number,
  unit: string,
  returnUnit: boolean = true,
  returnNumber: boolean = true
): string => {
  let mem = memory;

  if (mem > 1000) {
    mem = unit ? mem / 1024 : mem * 0.00000095367432;

    return calculateMemory(mem, unit ? 'GiB' : 'MiB', returnUnit);
  }

  return `${returnNumber ? round(mem, 2) : ''} ${returnUnit ? unit : ''}`;
};

export {
  statusHealth,
  utf8ToB64,
  getAlertObjectLink,
  getDependencyObjectLink,
  typeToString,
  getProcessObjectLink,
  calculateMemory,
};
