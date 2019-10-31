/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import defaultProps from 'recompose/defaultProps';

import sync from '../../../hocomponents/sync';
import patch from '../../../hocomponents/patchFuncArgs';
import actions from '../../../store/api/actions';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import queryControl from '../../../hocomponents/queryControl';
import ConnectionsTable from './table';
import withTabs from '../../../hocomponents/withTabs';
import Headbar from '../../../components/Headbar';
import Pull from '../../../components/Pull';
import Search from '../../../containers/search';
import { resourceSelector } from '../../../selectors';
import { CONN_MAP } from '../../../constants/remotes';
import mapProps from 'recompose/mapProps';
import Flex from '../../../components/Flex';
import { FormattedMessage } from 'react-intl';

type Props = {
  tabQuery?: string,
  location: Object,
  searchQuery: ?string,
  changeSearchQuery: Function,
  remotes: Array<Object>,
  datasources: Array<Object>,
  qorus: Array<Object>,
  users: Array<Object>,
  perms: Array<string>,
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
}: Props): React.Element<any> => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>
          {' '}
          <FormattedMessage id="Connections" />{' '}
        </Crumb>
        <CrumbTabs
          tabs={[
            { title: 'Datasources', suffix: `(${datasources.length})` },
            { title: 'Qorus', suffix: `(${qorus.length})` },
            { title: 'User', suffix: `(${users.length})` },
          ]}
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
          <ConnectionsTable
            type="datasources"
            location={location}
            remotes={datasources}
            perms={perms}
          />
        </SimpleTab>
        <SimpleTab name="qorus">
          <ConnectionsTable
            type="qorus"
            location={location}
            remotes={qorus}
            perms={perms}
          />
        </SimpleTab>
        <SimpleTab name="user">
          <ConnectionsTable
            type="user"
            location={location}
            remotes={users}
            perms={perms}
          />
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
  withTabs('datasources'),
  defaultProps({ query: { action: 'all' } }),
  connect(
    viewSelector,
    {
      load: actions.remotes.fetch,
    }
  ),
  patch('load', ['query']),
  sync('meta'),
  mapProps(({ remotes, ...rest }: Props): Props => ({
    datasources: remotes.filter(
      (remote: Object): boolean =>
        remote.conntype.toLowerCase() === CONN_MAP.datasources.toLowerCase()
    ),
    users: remotes.filter(
      (remote: Object): boolean =>
        remote.conntype.toLowerCase() === CONN_MAP.user.toLowerCase()
    ),
    qorus: remotes.filter(
      (remote: Object): boolean =>
        remote.conntype.toLowerCase() === CONN_MAP.qorus.toLowerCase()
    ),
    remotes,
    ...rest,
  })),
  queryControl('search')
)(Connections);
