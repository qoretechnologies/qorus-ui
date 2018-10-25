/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import queryControl from '../../../hocomponents/queryControl';
import ConnectionsTable from './table';
import withTabs from '../../../hocomponents/withTabs';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import Search from '../../../containers/search';

type Props = {
  tabQuery?: string,
  location: Object,
  searchQuery: ?string,
  changeSearchQuery: Function,
};

const Connections: Function = ({
  tabQuery,
  location,
  searchQuery,
  changeSearchQuery,
}: Props): React.Element<any> => (
  <div>
    <Headbar>
      <Breadcrumbs>
        <Crumb> Connections </Crumb>
        <CrumbTabs
          tabs={['Datasources', 'Qorus', 'User']}
          defaultTab="datasources"
        />
      </Breadcrumbs>
      <Pull right>
        <Search
          onSearchUpdate={changeSearchQuery}
          defaultValue={searchQuery}
          resource={tabQuery}
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="datasources">
          <ConnectionsTable type="datasources" location={location} />
        </SimpleTab>
        <SimpleTab name="qorus">
          <ConnectionsTable type="qorus" location={location} />
        </SimpleTab>
        <SimpleTab name="user">
          <ConnectionsTable type="user" location={location} />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </div>
);

export default compose(
  withTabs('datasources'),
  queryControl('search')
)(Connections);
