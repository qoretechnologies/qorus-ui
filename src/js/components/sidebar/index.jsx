// @flow
import React from 'react';
import { injectIntl } from 'react-intl';
import { browserHistory } from 'react-router';
import {
  Menu,
  MenuItem,
  MenuDivider,
  Icon,
  Tooltip,
  Position,
} from '@blueprintjs/core';
import map from 'lodash/map';
import withHandlers from 'recompose/withHandlers';
import compose from 'recompose/compose';

type Props = {
  menuCollapsed?: boolean,
  toggleMenu: Function,
  isTablet: boolean,
  light?: boolean,
};

const menu = {
  System: [
    { name: 'Dashboard', icon: 'timeline-bar-chart', link: '/' },
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
    {
      name: 'More',
      icon: 'more',
      submenu: [
        { name: 'Info', icon: 'info-sign', link: '/system/info' },
        { name: 'Logs', icon: 'comparison', link: '/system/logs' },
        { name: 'RBAC', icon: 'people', link: '/system/rbac' },
        { name: 'Errors', icon: 'error', link: '/system/errors' },
        { name: 'Cache', icon: 'database', link: '/system/sqlcache' },
        { name: 'HTTP Services', icon: 'globe-network', link: '/system/http' },
        { name: 'Valuemaps', icon: 'map', link: '/system/values' },
      ],
    },
  ],
  Interfaces: [
    { name: 'Workflows', icon: 'exchange', link: '/workflows' },
    { name: 'Services', icon: 'merge-links', link: '/services' },
    { name: 'Jobs', icon: 'calendar', link: '/jobs' },
    { name: 'Groups', icon: 'group-objects', link: '/groups' },
  ],
  Other: [
    { name: 'Search', icon: 'search', link: '/search' },
    { name: 'OCMD', icon: 'code', link: '/ocmd' },
    { name: 'Library', icon: 'book', link: '/library' },
    { name: 'Extensions', icon: 'layout', link: '/extensions' },
  ],
};

const tabletMenu = {
  System: [
    {
      name: 'System',
      icon: 'cog',
      submenu: [
        { name: 'Dashboard', icon: 'timeline-bar-chart', link: '/' },
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

let MenuElement: Function = ({
  iconName,
  name,
  submenu,
  link,
  menuCollapsed,
  intl: { formatMessage },
  handleClick,
}) => (
  <MenuItem
    iconName={iconName}
    onClick={handleClick}
    text={!menuCollapsed && name}
  >
    {submenu &&
      submenu.map(item => (
        <MenuElement
          key={item.name}
          iconName={item.icon}
          link={item.link}
          name={item.name}
        />
      ))}
  </MenuItem>
);

MenuElement = compose(
  injectIntl,
  withHandlers({
    handleClick: ({ link }): Function => (): void => {
      if (link) {
        browserHistory.push(link);
      }
    },
  })
)(MenuElement);

const MenuWrapper: Function = ({
  menuCollapsed,
  toggleMenu,
  intl: { formatMessage },
  isTablet,
}: Props) => (
  <Menu className={`sidebar ${menuCollapsed ? '' : 'full'}`}>
    {map(isTablet ? tabletMenu : menu, (values: Object, key: string) => (
      <div key={key}>
        {!menuCollapsed && (
          <li className="pt-menu-header">
            <h6>{key}</h6>
          </li>
        )}
        {values.map(({ name, icon, link, submenu }) =>
          menuCollapsed ? (
            <Tooltip
              key={name}
              content={name}
              position={submenu ? Position.BOTTOM : Position.RIGHT}
            >
              <MenuElement
                iconName={icon}
                link={link}
                name={name}
                submenu={submenu}
                menuCollapsed
              />
            </Tooltip>
          ) : (
            <MenuElement
              key={name}
              iconName={icon}
              link={link}
              name={name}
              submenu={submenu}
            />
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
);

const Sidebar: Function = ({
  isTablet,
  light,
  ...rest
}: Props): React.Element<any> => (
  <div className={light ? '' : 'pt-dark'}>
    <MenuWrapper isTablet={isTablet} {...rest} />
  </div>
);

export default injectIntl(Sidebar);
