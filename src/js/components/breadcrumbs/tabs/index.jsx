// @flow
import React from 'react';
import Pull from '../../Pull';
import withTabs from '../../../hocomponents/withTabs';
import capitalize from 'lodash/capitalize';

import CrumbTab from './tab';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Popover, Menu, MenuItem, Position } from '@blueprintjs/core';

type Props = {
  tabs: Array<string>,
  handleTabChange: Function,
  tabQuery?: string,
  compact?: boolean,
  queryIdentifier?: string,
};

const CrumbTabs: Function = ({
  tabs,
  handleTabChange,
  tabQuery,
  compact,
}: Props): React.Element<any> => (
  <Pull className="breadcrumb-tabs">
    {compact || tabs.length > 5 ? (
      <Popover
        position={Position.BOTTOM}
        useSmartPositioning
        useSmartArrowPositioning
        content={
          <Menu>
            {tabs
              .filter((tab: string): boolean => tab.toLowerCase() !== tabQuery)
              .map(
                (tab: string): React.Element<MenuItem> => (
                  <MenuItem
                    key={tab}
                    text={tab}
                    onClick={() => handleTabChange(tab.toLowerCase())}
                  />
                )
              )}
          </Menu>
        }
      >
        <CrumbTab title={capitalize(tabQuery)} active compact />
      </Popover>
    ) : (
      tabs.map(
        (tab: string): React.Element<CrumbTab> => (
          <CrumbTab
            key={tab}
            active={tab.toLowerCase() === tabQuery}
            title={tab}
            onClick={handleTabChange}
          />
        )
      )
    )}
  </Pull>
);

export default compose(
  withTabs(
    ({ defaultTab, tabs }) => defaultTab || tabs[0].toLowerCase(),
    ({ queryIdentifier }) => queryIdentifier || 'tab'
  ),
  onlyUpdateForKeys(['tabQuery', 'tabs'])
)(CrumbTabs);