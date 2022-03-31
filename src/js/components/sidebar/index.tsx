// @flow
import { Icon } from '@blueprintjs/core';
import classnames from 'classnames';
import map from 'lodash/map';
import React from 'react';
import { injectIntl } from 'react-intl';
import Scroll from 'react-scrollbar';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { transformMenu } from '../../helpers/system';
import SidebarSection from './section';

type SidebarProps = {
  isTablet: boolean;
  isCollapsed: boolean;
  isLight: boolean;
  toggleMenu: Function;
  location: Object;
  expandedSection: string;
  handleSectionToggle: Function;
  menu: Object;
  favoriteItems: Array<Object>;
  plugins: Array<string>;
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'SidebarPro... Remove this comment to see the full error message
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
SidebarProps): React.Element<any> => (
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
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message */}
      <div className="sidebarItem" onClick={toggleMenu}>
        <Icon icon={isCollapsed ? 'double-chevron-right' : 'double-chevron-left'} />{' '}
        {!isCollapsed && intl.formatMessage({ id: 'global.collapse' })}
      </div>
    </div>
  </div>
);

export default compose(
  withState('expandedSection', 'toggleSectionExpand', null),
  withHandlers({
    handleSectionToggle:
      ({ toggleSectionExpand }): Function =>
      (sectionId: string): void => {
        toggleSectionExpand((currentSectionId) => {
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
  onlyUpdateForKeys(['menu', 'favoriteItems', 'plugins']),
  injectIntl
)(Sidebar);
