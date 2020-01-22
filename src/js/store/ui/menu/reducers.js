// @flow
import { handleActions } from 'redux-actions';

const initialState: Object = {
  data: {
    Dashboard: [
      {
        name: 'Dashboard',
        icon: 'home',
        link: '/dashboard',
        activePaths: ['/dashboard'],
      },
    ],
    Interfaces: [
      {
        name: 'Workflows',
        icon: 'exchange',
        link: '/workflows',
        activePaths: ['/workflow', '/order'],
      },
      {
        name: 'Services',
        icon: 'merge-links',
        link: '/services',
        activePaths: ['/service'],
      },
      { name: 'Jobs', icon: 'calendar', link: '/jobs', activePaths: ['/job'] },
      { name: 'Groups', icon: 'group-objects', link: '/groups' },
      { name: 'Connections', icon: 'left-join', link: '/remote' },
      { name: 'Search', icon: 'search', link: '/search' },
    ],
    Global: [
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
        submenu: [
          { name: 'RBAC', icon: 'people', link: '/rbac' },
          { name: 'Valuemaps', icon: 'map', link: '/valuemaps' },
          {
            name: 'SLAs',
            icon: 'time',
            link: '/slas',
            activePaths: ['/slas', '/sla'],
          },
          { name: 'Releases', icon: 'git-push', link: '/releases' },
          { name: 'Errors', icon: 'error', link: '/errors' },
        ],
      },
    ],
    System: [
      {
        name: 'System',
        icon: 'cog',
        activePaths: ['/system'],
        submenu: [
          { name: 'Alerts', icon: 'warning-sign', link: '/system/alerts' },
          { name: 'Cluster', icon: 'heat-grid', link: '/system/cluster' },
          {
            name: 'Order Stats',
            icon: 'vertical-bar-chart-asc',
            link: '/system/orderStats',
          },
          // { name: 'Providers', icon: 'settings', link: '/system/providers' },
          { name: 'Options', icon: 'settings', link: '/system/options' },
          { name: 'Properties', icon: 'properties', link: '/system/props' },
          { name: 'Cache', icon: 'database', link: '/system/sqlcache' },
          { name: 'HTTP Services', icon: 'social-media', link: '/system/http' },
          { name: 'Config Items', icon: 'cog', link: '/system/config-items' },
        ],
      },
    ],
    Other: [
      {
        name: 'More',
        icon: 'more',
        activePaths: ['/ocmd', '/library', '/extensions', '/logs', '/info'],
        submenu: [
          { name: 'OCMD', icon: 'code', link: '/ocmd' },
          { name: 'Library', icon: 'book', link: '/library' },
          { name: 'Extensions', icon: 'layout', link: '/extensions' },
          { name: 'Logs', icon: 'comparison', link: '/logs' },
          { name: 'Info', icon: 'info-sign', link: '/info' },
        ],
      },
    ],
  },
};

export default handleActions({}, initialState);
