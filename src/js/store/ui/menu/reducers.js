// @flow
import { Link } from 'react-router';
import { handleActions } from 'redux-actions';

const initialState: Object = {
  data: {
    Dashboard: {
      items: [
        {
          name: 'Dashboard',
          icon: 'home',
          props: {
            to: '/dashboard',
          },
          activePaths: ['/dashboard'],
          id: 'dashboard',
          as: Link,
        },
      ],
    },
    Interfaces: {
      items: [
        {
          name: 'Workflows',
          icon: 'exchange',
          props: {
            to: '/workflows',
          },
          activePaths: ['/workflow', '/order'],
          id: 'workflows',
          as: Link,
        },
        {
          name: 'Services',
          icon: 'merge-links',
          props: {
            to: '/services',
          },
          activePaths: ['/service'],
          id: 'services',
          as: Link,
        },
        {
          name: 'Jobs',
          icon: 'calendar',
          props: {
            to: '/jobs',
          },
          activePaths: ['/job'],
          id: 'jobs',
          as: Link,
        },
        {
          name: 'Groups',
          icon: 'group-objects',
          props: {
            to: '/groups',
          },
          activePaths: ['/groups'],
          id: 'groups',
          as: Link,
        },
        {
          name: 'Connections',
          icon: 'left-join',
          props: {
            to: '/remote',
          },
          activePaths: ['/remote'],
          id: 'remote',
          as: Link,
        },
        {
          name: 'Search',
          icon: 'search',
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
          icon: 'layers',
          activePaths: [
            '/rbac',
            '/valuemaps',
            '/slas',
            '/sla',
            '/releases',
            '/errors',
          ],
          id: 'global',
          submenu: [
            {
              name: 'RBAC',
              icon: 'people',
              props: {
                to: '/rbac',
              },
              activePaths: ['/rbac'],
              id: 'rbac',
              as: Link,
            },
            {
              name: 'Valuemaps',
              icon: 'map',
              props: {
                to: '/valuemaps',
              },
              activePaths: ['/valuemaps'],
              id: 'valuemaps',
              as: Link,
            },
            {
              name: 'SLAs',
              icon: 'time',
              props: {
                to: '/slas',
              },
              activePaths: ['/slas', '/sla'],
              id: 'slas',
              as: Link,
            },
            {
              name: 'Releases',
              icon: 'git-push',
              props: {
                to: '/releases',
              },
              activePaths: ['/releases'],
              id: 'releases',
              as: Link,
            },
            {
              name: 'Errors',
              icon: 'error',
              props: {
                to: '/errors',
              },
              activePaths: ['/errors'],
              id: 'errors',
              as: Link,
            },
            {
              name: 'Types',
              icon: 'key',
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
          icon: 'cog',
          activePaths: ['/system'],
          id: 'system',
          submenu: [
            {
              name: 'Alerts',
              icon: 'warning-sign',
              props: {
                to: '/system/alerts',
              },
              activePaths: ['/system/alerts'],
              id: 'alerts',
              as: Link,
            },
            {
              name: 'Cluster',
              icon: 'heat-grid',
              props: {
                to: '/system/cluster',
              },
              activePaths: ['/system/cluster'],
              id: 'cluster',
              as: Link,
            },
            {
              name: 'Order Stats',
              icon: 'vertical-bar-chart-asc',
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
              icon: 'settings',
              props: {
                to: '/system/options',
              },
              activePaths: ['/system/options'],
              id: 'options',
              as: Link,
            },
            {
              name: 'Properties',
              icon: 'properties',
              props: {
                to: '/system/props',
              },
              activePaths: ['/system/props'],
              id: 'props',
              as: Link,
            },
            {
              name: 'Cache',
              icon: 'database',
              props: {
                to: '/system/sqlcache',
              },
              activePaths: ['/system/sqlcache'],
              id: 'sqlcache',
              as: Link,
            },
            {
              name: 'HTTP Services',
              icon: 'social-media',
              props: {
                to: '/system/http',
              },
              activePaths: ['/system/http'],
              id: 'http',
              as: Link,
            },
            {
              name: 'Config Items',
              icon: 'cog',
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
          icon: 'more',
          activePaths: ['/ocmd', '/library', '/extensions', '/logs', '/info'],
          id: 'more',
          submenu: [
            {
              name: 'OCMD',
              icon: 'code',
              props: { to: '/ocmd' },
              activePaths: ['/ocmd'],
              id: 'ocmd',
              as: Link,
            },
            {
              name: 'Library',
              icon: 'book',
              props: {
                to: '/library',
              },
              activePaths: ['/library'],
              id: 'library',
              as: Link,
            },
            {
              name: 'Extensions',
              icon: 'layout',
              props: {
                to: '/extensions',
              },
              activePaths: ['/extensions'],
              id: 'extensions',
              as: Link,
            },
            {
              name: 'Logs',
              icon: 'comparison',
              props: {
                to: '/logs',
              },
              activePaths: ['/logs'],
              id: 'logs',
              as: Link,
            },
            {
              name: 'Info',
              icon: 'info-sign',
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

export default handleActions({}, initialState);
