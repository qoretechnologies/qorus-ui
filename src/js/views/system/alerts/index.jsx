// @flow
import React from 'react';

import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
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
        <Crumb active> Ongoing </Crumb>
      </Breadcrumbs>
      <Pull right>
        <Search
          defaultValue={rest[`${tabQuery}SearchQuery`]}
          onSearchUpdate={rest[`change${capitalize(tabQuery)}searchQuery`]}
          resource="alerts"
        />
      </Pull>
    </Headbar>
    <Box top leftTopPaddingOnly>
      <Tabs active={tabQuery} onChange={handleTabChange} noContainer vertical>
        <Pane name="Ongoing">
          <AlertsTable location={location} type="ongoing" />
        </Pane>
        <Pane name="Transient">
          <AlertsTable location={location} type="transient" />
        </Pane>
      </Tabs>
    </Box>
  </div>
);

export default compose(
  withTabs('ongoing'),
  queryControl(({ tabQuery }) => `${tabQuery}Search`)
)(Alerts);
