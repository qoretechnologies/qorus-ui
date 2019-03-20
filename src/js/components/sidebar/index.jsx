// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import classnames from 'classnames';
import map from 'lodash/map';
import Scroll from 'react-scrollbar';

import SidebarSection from './section';
import { Icon } from '@blueprintjs/core';

type SidebarProps = {
  isTablet: boolean,
  isCollapsed: boolean,
  isLight: boolean,
  toggleMenu: Function,
};

const menu: Object = {
  Dashboard: [{ name: 'Dashboard', icon: 'timeline-bar-chart', link: '/' }],
  System: [
    {
      name: 'System',
      icon: 'cog',
      submenu: [
        { name: 'Alerts', icon: 'warning-sign', link: '/system/alerts' },
        { name: 'Cluster', icon: 'heat-grid', link: '/system/cluster' },
        {
          name: 'Order Stats',
          icon: 'vertical-bar-chart-asc',
          link: '/system/orderStats',
        },
        { name: 'Options', icon: 'cog', link: '/system/options' },
        { name: 'Connections', icon: 'left-join', link: '/system/remote' },
        { name: 'Properties', icon: 'properties', link: '/system/props' },
        { name: 'SLAs', icon: 'time', link: '/system/slas' },
        { name: 'Releases', icon: 'git-push', link: '/system/releases' },
        { name: 'Info', icon: 'info-sign', link: '/system/info' },
        { name: 'Logs', icon: 'comparison', link: '/system/logs' },
        { name: 'RBAC', icon: 'people', link: '/system/rbac' },
        { name: 'Errors', icon: 'error', link: '/system/errors' },
        { name: 'Cache', icon: 'database', link: '/system/sqlcache' },
        { name: 'HTTP Services', icon: 'home', link: '/system/http' },
        { name: 'Valuemaps', icon: 'map', link: '/system/values' },
      ],
    },
  ],
  Interfaces: [
    { name: 'Workflows', icon: 'exchange', link: '/workflows' },
    { name: 'Services', icon: 'merge-links', link: '/services' },
    { name: 'Jobs', icon: 'calendar', link: '/jobs' },
    { name: 'Groups', icon: 'merge-links', link: '/groups' },
  ],
  Other: [
    { name: 'Search', icon: 'search', link: '/search' },
    { name: 'OCMD', icon: 'code', link: '/ocmd' },
    { name: 'Library', icon: 'book', link: '/library' },
    { name: 'Extensions', icon: 'layout', link: '/extensions' },
  ],
};

const Sidebar: Function = ({
  isTablet,
  isCollapsed,
  isLight,
  toggleMenu,
}: SidebarProps): React.Element<any> => (
  <div
    className={classnames('sidebar', isLight ? 'light' : 'dark', {
      expanded: !isCollapsed,
    })}
  >
    <Scroll horizontal={false} className="sidebarScroll">
      {map(menu, (menuData: Array<Object>, menuKey: string) => (
        <SidebarSection
          sectionData={menuData}
          key={menuKey}
          isCollapsed={isCollapsed}
        />
      ))}
    </Scroll>
    <div className="sidebarSection">
      <div className="sidebarItem" onClick={toggleMenu}>
        <Icon
          iconName={
            isCollapsed ? 'double-chevron-right' : 'double-chevron-left'
          }
        />{' '}
        {!isCollapsed && 'Collapse'}
      </div>
    </div>
  </div>
);

export default compose(
  onlyUpdateForKeys(['isTablet', 'isLight', 'isCollapsed'])
)(Sidebar);
