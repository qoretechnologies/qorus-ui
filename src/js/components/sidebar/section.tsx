// @flow
import map from 'lodash/map';
import size from 'lodash/size';
import React from 'react';
import showIfPassed from '../../hocomponents/show-if-passed';
import SidebarItem from './item';

type SidebarSectionProps = {
  favoriteItems: Array<Object>;
  sectionData: Array<Object>;
  isCollapsed: boolean;
  location: Object;
  expandedSection: string;
  onSectionToggle: Function;
};

const SidebarSection: Function = ({
  sectionData,
  isCollapsed,
  location,
  expandedSection,
  onSectionToggle,
  favoriteItems,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
SidebarSectionProps): React.Element<any> => (
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

// @ts-ignore ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default showIfPassed(({ sectionData }) => size(sectionData))(SidebarSection);
