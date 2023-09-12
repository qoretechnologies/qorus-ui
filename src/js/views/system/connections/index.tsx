/* @flow */
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import { CONN_MAP } from '../../../constants/remotes';
import Search from '../../../containers/search';
import patch from '../../../hocomponents/patchFuncArgs';
import queryControl from '../../../hocomponents/queryControl';
import sync from '../../../hocomponents/sync';
import withTabs from '../../../hocomponents/withTabs';
import { resourceSelector } from '../../../selectors';
import actions from '../../../store/api/actions';
import ConnectionsTable from './table';

type Props = {
  tabQuery?: string;
  location: any;
  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  searchQuery: string;
  changeSearchQuery: Function;
  remotes: Array<Object>;
  datasources: Array<Object>;
  qorus: Array<Object>;
  users: Array<Object>;
  perms: Array<string>;
};

const Connections: Function = ({
  tabQuery,
  location,
  searchQuery,
  changeSearchQuery,
  datasources,
  qorus,
  users,
  perms,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>
          {' '}
          <FormattedMessage id="Connections" />{' '}
        </Crumb>
        <CrumbTabs
          tabs={[
            { title: 'Datasources', suffix: `${datasources.length}` },
            { title: 'Qorus', suffix: `${qorus.length}` },
            { title: 'User', suffix: `${users.length}` },
          ]}
          defaultTab="datasources"
        />
      </Breadcrumbs>
      <Pull right>
        <Search onSearchUpdate={changeSearchQuery} defaultValue={searchQuery} resource={tabQuery} />
      </Pull>
    </Headbar>
    <Box top noPadding>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="datasources">
          <ConnectionsTable
            type="datasources"
            location={location}
            remotes={datasources}
            perms={perms}
          />
        </SimpleTab>
        <SimpleTab name="qorus">
          <ConnectionsTable type="qorus" location={location} remotes={qorus} perms={perms} />
        </SimpleTab>
        <SimpleTab name="user">
          <ConnectionsTable type="user" location={location} remotes={users} perms={perms} />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </Flex>
);

const viewSelector: Function = createSelector(
  [resourceSelector('remotes'), resourceSelector('currentUser')],
  (meta, currentUser) => ({
    meta,
    perms: currentUser.data.permissions,
    remotes: meta.data,
  })
);

export default compose(
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('datasources'),
  defaultProps({ query: { action: 'all' } }),
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{}'.
    load: actions.remotes.fetch,
  }),
  patch('load', ['query']),
  sync('meta'),
  mapProps(
    ({ remotes, ...rest }: Props): Props => ({
      datasources: remotes.filter(
        (remote: any): boolean =>
          // @ts-ignore ts-migrate(2339) FIXME: Property 'conntype' does not exist on type 'Object... Remove this comment to see the full error message
          remote.conntype.toLowerCase() === CONN_MAP.datasources.toLowerCase()
      ),
      users: remotes.filter(
        (remote: any): boolean =>
          // @ts-ignore ts-migrate(2339) FIXME: Property 'conntype' does not exist on type 'Object... Remove this comment to see the full error message
          remote.conntype.toLowerCase() === CONN_MAP.user.toLowerCase()
      ),
      qorus: remotes.filter(
        (remote: any): boolean =>
          // @ts-ignore ts-migrate(2339) FIXME: Property 'conntype' does not exist on type 'Object... Remove this comment to see the full error message
          remote.conntype.toLowerCase() === CONN_MAP.qorus.toLowerCase()
      ),
      remotes,
      ...rest,
    })
  ),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search')
)(Connections);
