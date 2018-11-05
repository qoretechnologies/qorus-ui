/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import Users from './users';
import Roles from './roles';
import Permissions from './permissions';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import Box from '../../../components/box';
import Headbar from '../../../components/Headbar';
import Search from '../../../containers/search';
import titleManager from '../../../hocomponents/TitleManager';
import withTabs from '../../../hocomponents/withTabs';
import Pull from '../../../components/Pull';
import queryControl from '../../../hocomponents/queryControl';

type Props = {
  tabQuery: string,
  location: Object,
  changeSearchQuery: Function,
  searchQuery?: string,
};

const RBAC: Function = ({
  tabQuery,
  location,
  changeSearchQuery,
  searchQuery,
}: Props): React.Element<any> => (
  <div>
    <Headbar>
      <Breadcrumbs>
        <Crumb>RBAC</Crumb>
        <CrumbTabs tabs={['Users', 'Roles', 'Permissions']} />
      </Breadcrumbs>
      <Pull right>
        <Search
          onSearchUpdate={changeSearchQuery}
          defaultValue={searchQuery}
          resource={`rbac${tabQuery}`}
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="users">
          <Users location={location} />
        </SimpleTab>
        <SimpleTab name="roles">
          <Roles location={location} />
        </SimpleTab>
        <SimpleTab name="permissions">
          <Permissions location={location} />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </div>
);

export default compose(
  withTabs('users'),
  queryControl('search'),
  titleManager('RBAC')
)(RBAC);
