// @flow
import { IQorusSidebarItems } from '@qoretechnologies/reqore/dist/components/Sidebar';
import { Link } from 'react-router';
import { handleActions } from 'redux-actions';

export const defaultMenu: { data: IQorusSidebarItems } = {
  data: {
    Dashboard: {
      items: [
        {
          name: 'Dashboard',
          icon: 'Home2Fill',
          props: {
            to: '/dashboard',
          },
          activePaths: ['/dashboard'],
          id: 'dashboard',
          as: Link,
        },
        {
          name: 'IDE',
          icon: 'CodeBoxLine',
          props: {
            to: '/devtools',
          },
          activePaths: ['/devtools'],
          id: 'devtools',
          as: Link,
        },
      ],
    },
    Interfaces: {
      items: [
        {
          name: 'Workflows',
          icon: 'ExchangeLine',
          props: {
            to: '/workflows',
          },
          activePaths: ['/workflow', '/order'],
          id: 'workflows',
          as: Link,
        },
        {
          name: 'Services',
          icon: 'GitMergeLine',
          props: {
            to: '/services',
          },
          activePaths: ['/service'],
          id: 'services',
          as: Link,
        },
        {
          name: 'Jobs',
          icon: 'CalendarLine',
          props: {
            to: '/jobs',
          },
          activePaths: ['/job'],
          id: 'jobs',
          as: Link,
        },
        {
          name: 'Groups',
          icon: 'BubbleChartFill',
          props: {
            to: '/groups',
          },
          activePaths: ['/groups'],
          id: 'groups',
          as: Link,
        },
        {
          name: 'Connections',
          icon: 'StackshareLine',
          props: {
            to: '/remote',
          },
          activePaths: ['/remote'],
          id: 'remote',
          as: Link,
        },
        {
          name: 'Search',
          icon: 'SearchLine',
          props: {
            to: '/search',
          },
          activePaths: ['/search'],
          id: 'search',
          as: Link,
        },
      ],
    },
    Global: {
      items: [
        {
          name: 'Global',
          icon: 'LayoutGridFill',
          activePaths: ['/rbac', '/valuemaps', '/slas', '/sla', '/releases', '/errors'],
          id: 'global',
          submenu: [
            {
              name: 'RBAC',
              icon: 'GroupLine',
              props: {
                to: '/rbac',
              },
              activePaths: ['/rbac'],
              id: 'rbac',
              as: Link,
            },
            {
              name: 'Valuemaps',
              icon: 'MapLine',
              props: {
                to: '/valuemaps',
              },
              activePaths: ['/valuemaps'],
              id: 'valuemaps',
              as: Link,
            },
            {
              name: 'SLAs',
              icon: 'TimeLine',
              props: {
                to: '/slas',
              },
              activePaths: ['/slas', '/sla'],
              id: 'slas',
              as: Link,
            },
            {
              name: 'Releases',
              icon: 'InstallLine',
              props: {
                to: '/releases',
              },
              activePaths: ['/releases'],
              id: 'releases',
              as: Link,
            },
            {
              name: 'Errors',
              icon: 'ErrorWarningLine',
              props: {
                to: '/errors',
              },
              activePaths: ['/errors'],
              id: 'errors',
              as: Link,
            },
            {
              name: 'Types',
              icon: 'Key2Fill',
              props: {
                to: '/types',
              },
              activePaths: ['/types'],
              id: 'types',
              as: Link,
            },
          ],
        },
      ],
    },
    System: {
      items: [
        {
          name: 'System',
          icon: 'Settings2Line',
          activePaths: ['/system'],
          id: 'system',
          submenu: [
            {
              name: 'Alerts',
              icon: 'AlarmWarningLine',
              props: {
                to: '/system/alerts',
              },
              activePaths: ['/system/alerts'],
              id: 'alerts',
              as: Link,
            },
            {
              name: 'Cluster',
              icon: 'GridFill',
              props: {
                to: '/system/cluster',
              },
              activePaths: ['/system/cluster'],
              id: 'cluster',
              as: Link,
            },
            {
              name: 'Order Stats',
              icon: 'PieChartLine',
              props: {
                to: '/system/orderStats',
              },
              activePaths: ['/system/orderStats'],
              id: 'orderstats',
              as: Link,
            },
            // { name: 'Providers', icon: 'settings', link: '/system/providers' },
            {
              name: 'Options',
              icon: 'SettingsLine',
              props: {
                to: '/system/options',
              },
              activePaths: ['/system/options'],
              id: 'options',
              as: Link,
            },
            {
              name: 'Properties',
              icon: 'StackLine',
              props: {
                to: '/system/props',
              },
              activePaths: ['/system/props'],
              id: 'props',
              as: Link,
            },
            {
              name: 'Cache',
              icon: 'DatabaseLine',
              props: {
                to: '/system/sqlcache',
              },
              activePaths: ['/system/sqlcache'],
              id: 'sqlcache',
              as: Link,
            },
            {
              name: 'HTTP Services',
              icon: 'GlobeLine',
              props: {
                to: '/system/http',
              },
              activePaths: ['/system/http'],
              id: 'http',
              as: Link,
            },
            {
              name: 'Config Items',
              icon: 'Settings6Line',
              props: {
                to: '/system/config-items',
              },
              activePaths: ['/system/config-items'],
              id: 'config-items',
              as: Link,
            },
          ],
        },
      ],
    },
    Other: {
      items: [
        {
          name: 'More',
          icon: 'MoreFill',
          activePaths: ['/ocmd', '/library', '/extensions', '/logs', '/info'],
          id: 'more',
          submenu: [
            {
              name: 'OCMD',
              icon: 'TerminalLine',
              props: { to: '/ocmd' },
              activePaths: ['/ocmd'],
              id: 'ocmd',
              as: Link,
            },
            {
              name: 'Library',
              icon: 'Book3Line',
              props: {
                to: '/library',
              },
              activePaths: ['/library'],
              id: 'library',
              as: Link,
            },
            {
              name: 'Extensions',
              icon: 'AppsLine',
              props: {
                to: '/extensions',
              },
              activePaths: ['/extensions'],
              id: 'extensions',
              as: Link,
            },
            {
              name: 'Logs',
              icon: 'FileTextLine',
              props: {
                to: '/logs',
              },
              activePaths: ['/logs'],
              id: 'logs',
              as: Link,
            },
            {
              name: 'Info',
              icon: 'InformationLine',
              props: {
                to: '/info',
              },
              activePaths: ['/info'],
              id: 'info',
              as: Link,
            },
          ],
        },
      ],
    },
  },
};

export default handleActions({}, defaultMenu);
