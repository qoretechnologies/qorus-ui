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
import { connect } from 'react-redux';
import Flex from '../../../components/Flex';

type Props = {
  tabQuery: string,
  location: Object,
  changeSearchQuery: Function,
  searchQuery?: string,
  users: Array<string>,
  roles: Array<string>,
  perms: Array<string>,
};

const RBAC: Function = ({
  tabQuery,
  location,
  changeSearchQuery,
  searchQuery,
  users,
  roles,
  perms,
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>RBAC</Crumb>
        <CrumbTabs
          tabs={[
            { title: 'Users', suffix: `(${users.length})` },
            { title: 'Roles', suffix: `(${roles.length})` },
            { title: 'Permissions', suffix: `(${perms.length})` },
          ]}
        />
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
  </Flex>
);

export default compose(
  connect(
    (state: Object): Object => ({
      users: state.api.users.data,
      roles: state.api.roles.data,
      perms: state.api.perms.data,
    })
  ),
  withTabs('users'),
  queryControl('search'),
  titleManager('RBAC')
)(RBAC);
