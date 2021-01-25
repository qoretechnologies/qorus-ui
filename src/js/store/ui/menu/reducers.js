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
          link: '/dashboard',
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
          link: '/workflows',
          activePaths: ['/workflow', '/order'],
          id: 'workflows',
          as: Link,
        },
        {
          name: 'Services',
          icon: 'merge-links',
          link: '/services',
          activePaths: ['/service'],
          id: 'services',
          as: Link,
        },
        {
          name: 'Jobs',
          icon: 'calendar',
          link: '/jobs',
          activePaths: ['/job'],
          id: 'jobs',
          as: Link,
        },
        {
          name: 'Groups',
          icon: 'group-objects',
          link: '/groups',
          id: 'groups',
          as: Link,
        },
        {
          name: 'Connections',
          icon: 'left-join',
          link: '/remote',
          id: 'remote',
          as: Link,
        },
        {
          name: 'Search',
          icon: 'search',
          link: '/search',
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
              link: '/rbac',
              id: 'rbac',
              as: Link,
            },
            {
              name: 'Valuemaps',
              icon: 'map',
              link: '/valuemaps',
              id: 'valuemaps',
              as: Link,
            },
            {
              name: 'SLAs',
              icon: 'time',
              link: '/slas',
              activePaths: ['/slas', '/sla'],
              id: 'slas',
              as: Link,
            },
            {
              name: 'Releases',
              icon: 'git-push',
              link: '/releases',
              id: 'releases',
              as: Link,
            },
            {
              name: 'Errors',
              icon: 'error',
              link: '/errors',
              id: 'errors',
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
              link: '/system/alerts',
              id: 'alerts',
              as: Link,
            },
            {
              name: 'Cluster',
              icon: 'heat-grid',
              link: '/system/cluster',
              id: 'cluster',
              as: Link,
            },
            {
              name: 'Order Stats',
              icon: 'vertical-bar-chart-asc',
              link: '/system/orderStats',
              id: 'orderstats',
              as: Link,
            },
            // { name: 'Providers', icon: 'settings', link: '/system/providers' },
            {
              name: 'Options',
              icon: 'settings',
              link: '/system/options',
              id: 'options',
              as: Link,
            },
            {
              name: 'Properties',
              icon: 'properties',
              link: '/system/props',
              id: 'props',
              as: Link,
            },
            {
              name: 'Cache',
              icon: 'database',
              link: '/system/sqlcache',
              id: 'sqlcache',
              as: Link,
            },
            {
              name: 'HTTP Services',
              icon: 'social-media',
              link: '/system/http',
              id: 'http',
              as: Link,
            },
            {
              name: 'Config Items',
              icon: 'cog',
              link: '/system/config-items',
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
            { name: 'OCMD', icon: 'code', link: '/ocmd', id: 'ocmd', as: Link },
            {
              name: 'Library',
              icon: 'book',
              link: '/library',
              id: 'library',
              as: Link,
            },
            {
              name: 'Extensions',
              icon: 'layout',
              link: '/extensions',
              id: 'extensions',
              as: Link,
            },
            {
              name: 'Logs',
              icon: 'comparison',
              link: '/logs',
              id: 'logs',
              as: Link,
            },
            {
              name: 'Info',
              icon: 'info-sign',
              link: '/info',
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
