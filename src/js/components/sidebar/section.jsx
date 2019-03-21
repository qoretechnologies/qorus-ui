// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import map from 'lodash/map';

import SidebarItem from './item';

type SidebarSectionProps = {
  favoriteItems: Array<Object>,
  sectionData: Array<Object>,
  isCollapsed: boolean,
  location: Object,
  expandedSection: string,
  onSectionToggle: Function,
};

const SidebarSection: Function = ({
  sectionData,
  isCollapsed,
  location,
  expandedSection,
  onSectionToggle,
  favoriteItems,
}: SidebarSectionProps): React.Element<any> => (
  <div className="sidebarSection">
    {map(sectionData, (itemData: Object, key: number) => (
      <SidebarItem
        itemData={itemData}
        key={key}
        isCollapsed={isCollapsed}
        location={location}
        expandedSection={expandedSection}
        onSectionToggle={onSectionToggle}
        favoriteItems={favoriteItems}
      />
    ))}
  </div>
);

export default SidebarSection;
