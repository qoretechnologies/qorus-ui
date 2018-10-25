// @flow
import React from 'react';
import Pull from '../../Pull';
import withTabs from '../../../hocomponents/withTabs';

import CrumbTab from './tab';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

type Props = {
  tabs: Array<string>,
  changeTabQuery: Function,
  tabQuery?: string,
};

const CrumbTabs: Function = ({
  tabs,
  changeTabQuery,
  tabQuery,
}: Props): React.Element<any> => (
  <Pull className="breadcrumb-tabs">
    {tabs.map(
      (tab: string): React.Element<CrumbTab> => (
        <CrumbTab
          key={tab}
          active={tab.toLowerCase() === tabQuery}
          title={tab}
          onClick={changeTabQuery}
        />
      )
    )}
  </Pull>
);

export default compose(
  withTabs(({ defaultTab, tabs }) => defaultTab || tabs[0].toLowerCase()),
  onlyUpdateForKeys(['tabQuery', 'tabs'])
)(CrumbTabs);
