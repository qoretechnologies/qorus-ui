/* @flow */
import classNames from 'classnames';
import round from 'lodash/round';
import size from 'lodash/size';
import reduce from 'lodash/reduce';
import upperFirst from 'lodash/upperFirst';
import includes from 'lodash/includes';

const statusHealth: Function = (health: string): string =>
  classNames({
    danger: health === 'RED' || health === 'ERROR',
    success: health === 'GREEN',
    warning: health === 'YELLOW' || health === 'UNKNOWN',
    none: health === 'UNREACHABLE',
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
    resource: 'remote',
    uses: 'name',
    query: 'tab=user&paneId',
  },
  REMOTE: {
    resource: 'remote',
    uses: 'name',
    query: 'tab=qorus&paneId',
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
    resource: 'remote',
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

  if (!res) {
    return '#';
  }

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

  if (!res) {
    return '#';
  }

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

const getProcessObjectLink: Function = (prcs: Object) => {
  switch (prcs.type) {
    case 'qdsp':
      return `/remote?paneId=${prcs.client_id}`;
    case 'qwf':
      return `/workflows?paneId=${prcs.wfid}&paneTab=detail`;
    case 'qsvc':
      return `/services?paneId=${prcs.svcid}&paneTab=detail`;
    case 'qjob':
      return `/jobs?paneId=${prcs.jobid}&paneTab=detail`;
    default:
      return null;
  }
};

const getProcessObjectType: Function = (prcs: Object) => {
  switch (prcs.type) {
    case 'qdsp':
      return 'remote';
    case 'qwf':
      return 'workflow';
    case 'qsvc':
      return 'service';
    case 'qjob':
      return 'job';
    default:
      return null;
  }
};

const getProcessObjectInterface: Function = (prcs: Object) => {
  switch (prcs.type) {
    case 'qdsp':
      return 'remotes';
    case 'qwf':
      return 'workflows';
    case 'qsvc':
      return 'services';
    case 'qjob':
      return 'jobs';
    default:
      return null;
  }
};

const getProcessObjectInterfaceId: Function = (prcs: Object) => {
  switch (prcs.type) {
    case 'qdsp':
      return 'client_id';
    case 'qwf':
      return 'wfid';
    case 'qsvc':
      return 'svcid';
    case 'qjob':
      return 'jobid';
    default:
      return null;
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

const getSlicedRemotes: Function = (remotes): ?Array<Object> => {
  const remotesLen: number = remotes ? remotes.length : 0;

  if (remotesLen < 1) {
    return null;
  }

  return remotesLen > 5 ? remotes.slice(0, 5) : remotes;
};

const getLineCount: Function = (value: string): number => {
  try {
    return value.match(/[^\n]*\n[^\n]*/gi).length;
  } catch (e) {
    return 0;
  }
};

const transformMenu: Function = (
  menu: Object,
  favoriteItems: Array<Object>,
  plugins: Array<string>
): Object => {
  let newMenu: Object = { ...menu };

  if (size(plugins)) {
    newMenu = {
      ...newMenu,
      Plugins: [
        {
          name: 'Plugins',
          icon: 'helper-management',
          activePaths: ['/plugins'],
          submenu: createPluginsMenu(plugins),
        },
      ],
    };
  }

  if (size(favoriteItems)) {
    newMenu = reduce(
      newMenu,
      (cur, menuSection: Array<Object>, name: string) => {
        let newSection = [...menuSection];

        newSection = newSection
          .map((newSectionItem: Object) => {
            const copySectionItem: Object = { ...newSectionItem };

            if (copySectionItem.submenu) {
              copySectionItem.submenu = copySectionItem.submenu.filter(
                (submenuItem: Object) =>
                  !favoriteItems.find(
                    (favoriteItem: Object) =>
                      favoriteItem.name === submenuItem.name
                  )
              );

              if (size(copySectionItem.submenu)) {
                return copySectionItem;
              }
            } else {
              if (
                !favoriteItems.find(
                  (favoriteItem: Object) =>
                    favoriteItem.name === copySectionItem.name
                )
              ) {
                return copySectionItem;
              }
            }
          })
          .filter((newSectionItem: Object) => newSectionItem);

        return { ...cur, [name]: newSection };
      },
      {}
    );

    newMenu = { Favorites: favoriteItems, ...newMenu };
  }

  return newMenu;
};

const createPluginsMenu: Function = (plugins: Array<string>): Array<Object> =>
  plugins.map((plugin: string) => ({
    name: upperFirst(plugin),
    link: `/plugins/${plugin}`,
    icon: getPluginIcon(plugin),
  }));

const getPluginIcon: Function = (plugin: string): string => {
  switch (plugin) {
    case 'oauth2':
      return 'id-number';
    default:
      return 'help';
  }
};

const hasPlugin: Function = (pluginName: string, plugins: Array<string>) =>
  plugins && plugins.includes(pluginName);

export {
  statusHealth,
  utf8ToB64,
  getAlertObjectLink,
  getDependencyObjectLink,
  typeToString,
  getProcessObjectLink,
  getProcessObjectType,
  getProcessObjectInterfaceId,
  getProcessObjectInterface,
  calculateMemory,
  getSlicedRemotes,
  getLineCount,
  transformMenu,
  hasPlugin,
};
