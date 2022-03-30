// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import map from 'lodash/map';

import SidebarItem from './item';
import showIfPassed from '../../hocomponents/show-if-passed';
import size from 'lodash/size';

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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default showIfPassed(({ sectionData }) => size(sectionData))(
  SidebarSection
);
