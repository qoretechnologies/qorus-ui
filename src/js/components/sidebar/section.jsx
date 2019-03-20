// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import map from 'lodash/map';

import SidebarItem from './item';

type SidebarSectionProps = {
  sectionData: Array<Object>,
  isCollapsed: boolean,
};

const SidebarSection: Function = ({
  sectionData,
  isCollapsed,
}: SidebarSectionProps): React.Element<any> => (
  <div className="sidebarSection">
    {map(sectionData, (itemData: Object, key: number) => (
      <SidebarItem itemData={itemData} key={key} isCollapsed={isCollapsed} />
    ))}
  </div>
);

export default compose(onlyUpdateForKeys(['sectionData', 'isCollapsed']))(
  SidebarSection
);
