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
};

const menu = {
  System: [
    { name: 'system.dashboard', icon: 'timeline-bar-chart', link: '/' },
    { name: 'system.alerts', icon: 'warning-sign', link: '/system/alerts' },
    { name: 'system.cluster', icon: 'heat-grid', link: '/system/cluster' },
    {
      name: 'system.orderStats',
      icon: 'vertical-bar-chart-asc',
      link: '/system/orderStats',
    },
    { name: 'system.options', icon: 'cog', link: '/system/options' },
    { name: 'system.connections', icon: 'left-join', link: '/system/remote' },
    { name: 'system.properties', icon: 'properties', link: '/system/props' },
    { name: 'system.slas', icon: 'time', link: '/system/slas' },
    { name: 'system.releases', icon: 'git-push', link: '/system/releases' },
    {
      name: 'system.more',
      icon: 'more',
      submenu: [
        { name: 'Info', icon: 'info-sign', link: '/system/info' },
        { name: 'Logs', icon: 'comparison', link: '/system/logs' },
        { name: 'RBAC', icon: 'people', link: '/system/rbac' },
        { name: 'Errors', icon: 'error', link: '/system/errors' },
        { name: 'system.cache', icon: 'database', link: '/system/sqlcache' },
        { name: 'system.httpserv', icon: 'home', link: '/system/http' },
        { name: 'system.valuemaps', icon: 'map', link: '/system/values' },
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
  icon,
  name,
  submenu,
  link,
  menuCollapsed,
  intl: { formatMessage },
  handleClick,
}) => (
  <MenuItem
    iconName={icon}
    onClick={handleClick}
    text={!menuCollapsed && formatMessage({ id: name })}
  >
    {submenu &&
      submenu.map(item => (
        <MenuElement iconName={item.icon} link={item.link} name={item.name} />
      ))}
  </MenuItem>
);

MenuElement = compose(
  injectIntl,
  withHandlers({
    handleClick: ({ link }): Function => (): void => {
      browserHistory.push(link);
    },
  })
)(MenuElement);

const MenuWrapper: Function = ({
  menuCollapsed,
  toggleMenu,
  intl: { formatMessage },
}: Props) => (
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
                content={formatMessage({ id: name })}
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
}: Props): React.Element<any> =>
  isTablet ? (
    <MenuWrapper {...rest} />
  ) : (
    <div className={light ? '' : 'pt-dark'}>
      <MenuWrapper {...rest} />
    </div>
  );

export default injectIntl(Sidebar);
