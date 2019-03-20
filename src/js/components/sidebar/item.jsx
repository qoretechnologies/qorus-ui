// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Icon } from '@blueprintjs/core';
import { Link } from 'react-router';
import map from 'lodash/map';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

type SidebarItemProps = {
  itemData: Object,
  isCollapsed: boolean,
  subItem: boolean,
  onExpandClick: Function,
  isExpanded: boolean,
};

const SidebarItem: Function = ({
  itemData,
  isCollapsed,
  subItem,
  onExpandClick,
  isExpanded,
}: SidebarItemProps): React.Element<any> =>
  itemData.link ? (
    <Link to={itemData.link} className="sidebarLink" onClick={onExpandClick}>
      <div className={`sidebarItem ${subItem && 'sidebarSubItem'}`}>
        <Icon iconName={itemData.icon} /> {!isCollapsed && itemData.name}
      </div>
    </Link>
  ) : (
    <div
      className={`sidebarItem ${subItem && 'sidebarSubItem'}`}
      onClick={onExpandClick}
    >
      <Icon iconName={itemData.icon} /> {!isCollapsed && itemData.name}
      {onExpandClick && (
        <Icon
          iconName={isExpanded ? 'caret-up' : 'caret-down'}
          className="submenuExpand"
        />
      )}
    </div>
  );

const SidebarItemWrapper: Function = ({
  itemData,
  isCollapsed,
  isExpanded,
  handleExpandClick,
}: SidebarItemProps): React.Element<any> => (
  <React.Fragment>
    <SidebarItem
      itemData={itemData}
      isCollapsed={isCollapsed}
      onExpandClick={itemData.submenu && handleExpandClick}
      isExpanded={isExpanded}
    />
    {isExpanded &&
      map(itemData.submenu, (subItemData: Object, key: number) => (
        <SidebarItem
          itemData={subItemData}
          key={key}
          isCollapsed={isCollapsed}
          subItem
        />
      ))}
  </React.Fragment>
);

export default compose(
  withState('isExpanded', 'changeExpanded', false),
  withHandlers({
    handleExpandClick: ({ changeExpanded }): Function => (): void => {
      changeExpanded(isExpanded => !isExpanded);
    },
  }),
  onlyUpdateForKeys(['isCollapsed', 'isExpanded'])
)(SidebarItemWrapper);
