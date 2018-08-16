// @flow
import React from 'react';

import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import AlertsTable from './table';
import Tabs, { Pane } from '../../../components/tabs';
import withTabs from '../../../hocomponents/withTabs';

type Props = {
  location: Object,
  tabQuery: string,
  handleTabChange: Function,
};

const Alerts: Function = ({
  location,
  tabQuery,
  handleTabChange,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb> Alerts </Crumb>
      <Crumb active> Ongoing </Crumb>
    </Breadcrumbs>
    <Box top>
      <Tabs active={tabQuery} onChange={handleTabChange} noContainer>
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

export default withTabs('ongoing')(Alerts);
