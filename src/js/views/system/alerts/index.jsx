// @flow
import React from 'react';

import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import AlertsTable from './table';
import AlertsToolbar from './toolbar';

type Props = {
  location: Object,
};

const Alerts: Function = ({ location }: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb> Alerts </Crumb>
      <Crumb active> Ongoing </Crumb>
    </Breadcrumbs>
    <AlertsToolbar type="ongoing" location={location} />
    <Box noPadding>
      <AlertsTable location={location} type="ongoing" />
    </Box>
    <Breadcrumbs>
      <Crumb> Alerts </Crumb>
      <Crumb active> Transient </Crumb>
    </Breadcrumbs>
    <AlertsToolbar type="transient" location={location} />
    <Box noPadding>
      <AlertsTable location={location} type="transient" />
    </Box>
  </div>
);

Alerts.Table = AlertsTable;

export default Alerts;
