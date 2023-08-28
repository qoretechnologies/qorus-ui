import size from 'lodash/size';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import Search from '../../../containers/search';
import titleManager from '../../../hocomponents/TitleManager';
import queryControl from '../../../hocomponents/queryControl';
import viewBehindPermission from '../../../hocomponents/viewBehindPermission';
import withTabs from '../../../hocomponents/withTabs';
import OAuth2View from '../../../views/oauth2';
import Permissions from './permissions';
import Roles from './roles';
import Users from './users';

type Props = {
  tabQuery: string;
  location: any;
  changeSearchQuery: Function;
  searchQuery?: string;
  users: Array<string>;
  roles: Array<string>;
  perms: Array<string>;
  clients?: any[];
  system: any;
};

const RBAC: Function = ({
  tabQuery,
  location,
  changeSearchQuery,
  searchQuery,
  users,
  roles,
  perms,
  clients,
  system,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const tabs = [
    { title: 'Users', suffix: `(${users.length || '?'})` },
    { title: 'Roles', suffix: `(${roles.length || '?'})` },
    { title: 'Permissions', suffix: `(${perms.length || '?'})` },
  ];

  if (system?.oauth2_enabled) {
    tabs.push({ title: 'OAuth2', suffix: `(${size(clients) || '?'})` });
  }

  return (
    <Flex>
      <Headbar>
        <Breadcrumbs>
          <Crumb>
            <FormattedMessage id="RBAC" />
          </Crumb>
          <CrumbTabs tabs={tabs} />
        </Breadcrumbs>
        {tabQuery !== 'oauth2' && (
          <Pull right>
            <Search onSearchUpdate={changeSearchQuery} defaultValue={searchQuery} resource="rbac" />
          </Pull>
        )}
      </Headbar>
      <Box top noPadding>
        <SimpleTabs activeTab={tabQuery}>
          <SimpleTab name="users">
            {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
            <Users location={location} />
          </SimpleTab>
          <SimpleTab name="roles">
            {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
            <Roles location={location} />
          </SimpleTab>
          <SimpleTab name="permissions">
            {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
            <Permissions location={location} />
          </SimpleTab>
          {system?.oauth2_enabled && (
            <SimpleTab name="oauth2">
              <OAuth2View />
            </SimpleTab>
          )}
        </SimpleTabs>
      </Box>
    </Flex>
  );
};

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  viewBehindPermission(['USER-CONTROL']),
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    users: state.api.users.data,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    roles: state.api.roles.data,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    perms: state.api.perms.data,
    system: state.api.system.data,
    clients: state.api.clients.data,
  })),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('users'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  titleManager('RBAC')
)(RBAC);
