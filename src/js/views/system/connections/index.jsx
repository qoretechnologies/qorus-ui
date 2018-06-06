/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import capitalize from 'lodash/capitalize';

import Tabs, { Pane } from '../../../components/tabs';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb } from '../../../components/breadcrumbs';
import queryControl from '../../../hocomponents/queryControl';
import ConnectionsTable from './table';

type Props = {
  tabQuery?: string,
  changeTabQuery: Function,
  handleTabChange: Function,
  location: Object,
};

const Connections: Function = ({
  tabQuery: tabQuery = 'datasources',
  handleTabChange,
  location,
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb> Connections </Crumb>
      <Crumb active>{capitalize(tabQuery)}</Crumb>
    </Breadcrumbs>
    <Box top>
      <Tabs
        active={tabQuery}
        id="connections"
        onChange={handleTabChange}
        noContainer
      >
        <Pane name="Datasources">
          <ConnectionsTable type="datasources" location={location} />
        </Pane>
        <Pane name="Qorus">
          <ConnectionsTable type="qorus" location={location} />
        </Pane>
        <Pane name="User">
          <ConnectionsTable type="user" location={location} />
        </Pane>
      </Tabs>
    </Box>
  </div>
);

export default compose(
  queryControl('tab'),
  withHandlers({
    handleTabChange: ({ changeTabQuery }: Props): Function => (
      tabId: string
    ): void => {
      changeTabQuery(tabId);
    },
  })
)(Connections);
