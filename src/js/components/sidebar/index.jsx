// @flow
import React from 'react';
import {
  Intent,
  Menu,
  MenuItem,
  MenuDivider,
  Icon,
  Tooltip,
  Position,
} from '@blueprintjs/core';
import map from 'lodash/map';

type Props = {
  menuCollapsed?: boolean,
  toggleMenu: Function,
};

const menu = {
  System: [
    { name: 'Dashboard', icon: 'timeline-bar-chart', link: '/' },
    { name: 'Alerts', icon: 'warning-sign', link: '/system/alerts' },
    { name: 'Cluster', icon: 'heat-grid', link: '/system/cluster' },
    { name: 'Options', icon: 'cog', link: '/system/options' },
    { name: 'Connections', icon: 'left-join', link: '/system/remote' },
    { name: 'Properties', icon: 'properties', link: '/system/props' },
    { name: 'SLAs', icon: 'time', link: '/system/slas' },
    { name: 'Valuemaps', icon: 'map', link: '/system/values' },
    { name: 'SQL Cache', icon: 'database', link: '/system/sqlcache' },
    { name: 'HTTP Services', icon: 'home', link: '/system/http' },
    { name: 'Releases', icon: 'git-push', link: '/system/releases' },
    {
      name: 'Other',
      icon: 'more',
      submenu: [
        { name: 'Info', icon: 'info-sign', link: '/system/info' },
        { name: 'Logs', icon: 'comparison', link: '/system/logs' },
        { name: 'RBAC', icon: 'people', link: '/system/rbac' },
        { name: 'Errors', icon: 'error', link: '/system/errors' },
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
  menuCollapsed,
  toggleMenu,
}: Props): React.Element<any> => (
  <div className="pt-dark">
    <Menu className={`sidebar ${menuCollapsed ? '' : 'full'}`}>
      {map(menu, (values: Object, key: string) => (
        <div>
          {!menuCollapsed && (
            <li className="pt-menu-header">
              <h6>{key}</h6>
            </li>
          )}
          {values.map(
            ({ name, icon, link, submenu }) =>
              menuCollapsed ? (
                <Tooltip
                  content={name}
                  position={submenu ? Position.BOTTOM : Position.RIGHT}
                >
                  <MenuItem iconName={icon} href={link}>
                    {submenu &&
                      submenu.map(item => (
                        <MenuItem iconName={item.icon} href={item.link} />
                      ))}
                  </MenuItem>
                </Tooltip>
              ) : (
                <MenuItem text={name} iconName={icon} href={link}>
                  {submenu &&
                    submenu.map(item => (
                      <MenuItem
                        text={item.name}
                        iconName={item.icon}
                        href={item.link}
                      />
                    ))}
                </MenuItem>
              )
          )}
          <MenuDivider />
        </div>
      ))}
      {menuCollapsed ? (
        <MenuItem iconName="menu-open" onClick={toggleMenu} />
      ) : (
        <MenuItem
          iconName="menu"
          label={<Icon iconName="caret-left" />}
          text="Collapse"
          onClick={toggleMenu}
        />
      )}
    </Menu>
  </div>
);

export default Sidebar;
