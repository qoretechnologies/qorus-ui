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
import viewBehindPermission from '../../../hocomponents/viewBehindPermission';
import { FormattedMessage } from 'react-intl';

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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>
          <FormattedMessage id="RBAC" />
        </Crumb>
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
          resource="rbac"
        />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="users">
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          <Users location={location} />
        </SimpleTab>
        <SimpleTab name="roles">
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          <Roles location={location} />
        </SimpleTab>
        <SimpleTab name="permissions">
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          <Permissions location={location} />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </Flex>
);

export default compose(
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  viewBehindPermission(['USER-CONTROL']),
  connect((state: Object): Object => ({
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    users: state.api.users.data,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    roles: state.api.roles.data,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    perms: state.api.perms.data,
  })),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('users'),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  titleManager('RBAC')
)(RBAC);
