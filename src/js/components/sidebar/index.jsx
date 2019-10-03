// @flow
import React from 'react';
import compose from 'recompose/compose';
import classnames from 'classnames';
import map from 'lodash/map';
import Scroll from 'react-scrollbar';

import SidebarSection from './section';
import { Icon } from '@blueprintjs/core';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import mapProps from 'recompose/mapProps';
import { transformMenu } from '../../helpers/system';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type SidebarProps = {
  isTablet: boolean,
  isCollapsed: boolean,
  isLight: boolean,
  toggleMenu: Function,
  location: Object,
  expandedSection: string,
  handleSectionToggle: Function,
  menu: Object,
  favoriteItems: Array<Object>,
  plugins: Array<string>,
};

const Sidebar: Function = ({
  isTablet,
  isCollapsed,
  isLight,
  toggleMenu,
  location,
  expandedSection,
  handleSectionToggle,
  menu,
  favoriteItems,
}: SidebarProps): React.Element<any> => (
  <div
    className={classnames('sidebar', isLight ? 'light' : 'dark', {
      expanded: !isCollapsed,
    })}
  >
    <Scroll horizontal={false} className="sidebarScroll">
      {map(menu, (menuData: Array<Object>, menuKey: string) => (
        <SidebarSection
          location={location}
          sectionData={menuData}
          key={menuKey}
          isCollapsed={isCollapsed}
          expandedSection={expandedSection}
          onSectionToggle={handleSectionToggle}
          favoriteItems={favoriteItems}
        />
      ))}
    </Scroll>
    <div className="sidebarSection" id="menuCollapse">
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
  withState('expandedSection', 'toggleSectionExpand', null),
  withHandlers({
    handleSectionToggle: ({ toggleSectionExpand }): Function => (
      sectionId: string
    ): void => {
      toggleSectionExpand(currentSectionId => {
        if (currentSectionId === sectionId) {
          return null;
        }

        return sectionId;
      });
    },
  }),
  mapProps(({ menu, favoriteItems, plugins, ...rest }) => ({
    menu: transformMenu(menu, favoriteItems, plugins),
    favoriteItems,
    plugins,
    ...rest,
  })),
  onlyUpdateForKeys(['menu', 'favoriteItems', 'plugins'])
)(Sidebar);
