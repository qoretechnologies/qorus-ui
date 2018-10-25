// @flow
import React from 'react';

import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import AlertsTable from './table';
import Tabs, { Pane } from '../../../components/tabs';
import withTabs from '../../../hocomponents/withTabs';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import compose from 'recompose/compose';
import queryControl from '../../../hocomponents/queryControl';
import capitalize from 'lodash/capitalize';
import Search from '../../../containers/search';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';

type Props = {
  location: Object,
  tabQuery: string,
  handleTabChange: Function,
};

const Alerts: Function = ({
  tabQuery,
  handleTabChange,
  location,
  ...rest
}: Props): React.Element<any> => (
  <div>
    <Headbar>
      <Breadcrumbs>
        <Crumb> Alerts </Crumb>
        <CrumbTabs tabs={['Ongoing', 'Transient']} defaultTab="ongoing" />
      </Breadcrumbs>
      <Pull right>
        <Search
          defaultValue={rest[`${tabQuery}SearchQuery`]}
          onSearchUpdate={rest[`change${capitalize(tabQuery)}searchQuery`]}
          resource="alerts"
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="ongoing">
          <AlertsTable location={location} type="ongoing" />
        </SimpleTab>
        <SimpleTab name="transient">
          <AlertsTable location={location} type="transient" />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </div>
);

export default compose(
  withTabs('ongoing'),
  queryControl(({ tabQuery }) => `${tabQuery}Search`)
)(Alerts);
