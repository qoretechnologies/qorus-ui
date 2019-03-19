// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';
import { Link } from 'react-router';
import map from 'lodash/map';

type SidebarItemProps = {
  itemData: Object,
  isCollapsed: boolean,
};

const SidebarItem: Function = ({
  itemData,
  isCollapsed,
}: SidebarItemProps): React.Element<any> =>
  itemData.link ? (
    <Link to={itemData.link} className="sidebarLink">
      <div className="sidebarItem">
        <Icon iconName={itemData.icon} /> {!isCollapsed && itemData.name}
      </div>
    </Link>
  ) : (
    <div className="sidebarItem">
      <Icon iconName={itemData.icon} /> {!isCollapsed && itemData.name}
    </div>
  );

const SidebarItemWrapper: Function = ({
  itemData,
  isCollapsed,
}: SidebarItemProps): React.Element<any> => (
  <React.Fragment>
    <SidebarItem itemData={itemData} isCollapsed={isCollapsed} />
    {itemData.submenu &&
      map(itemData.submenu, (subItemData: Object, key: number) => (
        <SidebarItem
          itemData={subItemData}
          key={key}
          isCollapsed={isCollapsed}
        />
      ))}
  </React.Fragment>
);

export default compose(onlyUpdateForKeys(['isCollapsed']))(SidebarItemWrapper);
