/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';

import { Table, Tbody, Thead, Tr, Th } from '../../../components/new_table';
import sync from '../../../hocomponents/sync';
import patch from '../../../hocomponents/patchFuncArgs';
import Icon from '../../../components/icon';
import actions from '../../../store/api/actions';
import withSort from '../../../hocomponents/sort';
import withLoadMore from '../../../hocomponents/loadMore';
import { sortDefaults } from '../../../constants/sort';
import { resourceSelector, querySelector } from '../../../selectors';
import withPane from '../../../hocomponents/pane';
import withModal from '../../../hocomponents/modal';
import ConnectionPane from './pane';
import ConnectionRow from './row';
import ManageModal from './modals/manage';
import { Control as Button } from '../../../components/controls';
import Toolbar from '../../../components/toolbar';
import { CONN_MAP } from '../../../constants/remotes';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import { findBy } from '../../../helpers/search';

type Props = {
  location: Object,
  load: Function,
  remotes: Array<Object>,
  updateDone: Function,
  handleHighlightEnd: Function,
  paneId: string,
  openPane: Function,
  sortData: Object,
  onSortChange: Function,
  params: Object,
  type: string,
  canLoadMore?: boolean,
  handleLoadMore: Function,
  handleAddClick: Function,
  openModal: Function,
  closeModal: Function,
  manage: Function,
  searchQuery: ?string,
  changeSearchQuery: Function,
};

const remotesSelector: Function = (state: Object, props: Object): Array<*> => (
  state.api.remotes.data.filter(a =>
    (a.conntype.toLowerCase() === CONN_MAP[props.params.type].toLowerCase())
  )
);


const filterRemotes: Function = (query: string): Function => (remotes: Array<Object>) => (
  findBy(
    ['name', 'url', 'desc', 'options', 'type', 'status', 'user', 'db', 'pass'],
    query,
    remotes
  )
);

const filteredRemotes: Function = createSelector(
  [remotesSelector, querySelector('search')],
  (remotes: Array<Object>, query: ?string): Array<Object> => filterRemotes(query)(remotes)
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('remotes'),
    filteredRemotes,
  ],
  (meta, remotes) => ({
    meta,
    remotes,
  })
);

const ConnectionTable: Function = ({
  sortData,
  onSortChange,
  paneId,
  openPane,
  remotes,
  type,
  canLoadMore,
  handleLoadMore,
  handleAddClick,
  searchQuery,
  changeSearchQuery,
}: Props): React.Element<any> => (
  <div className="tab-pane active">
    <Toolbar>
      {type !== 'qorus' && (
        <Button
          big
          onClick={handleAddClick}
          btnStyle="success"
          icon="plus"
          label="Add new"
        />
      )}
      <Search
        onSearchUpdate={changeSearchQuery}
        defaultValue={searchQuery}
        resource={type}
      />
    </Toolbar>
    <Table
      fixed
      hover
      striped
      key={type}
      marginBottom={canLoadMore ? 40 : 0}
    >
      <Thead>
        <Tr
          sortData={sortData}
          onSortChange={onSortChange}
        >
          <Th className="narrow" name="up">Up</Th>
          <Th className="narrow">-</Th>
          <Th className="narrow">Edit</Th>
          <Th className="tiny">
            <Icon icon="exclamation-triangle" />
          </Th>
          <Th className="name" name="name">Name</Th>
          {type === 'datasources' ? (
            <Th className="text">Options</Th>
          ) : (
            <Th className="text" name="url">URL</Th>
          )}
          <Th className="text" name="desc">Description</Th>
          <Th className="normal">-</Th>
        </Tr>
      </Thead>
      <Tbody>
        {remotes.map((remote: Object): React.Element<any> => (
          <ConnectionRow
            key={`connection_${remote.name}`}
            isActive={remote.name === paneId}
            hasAlerts={remote.alerts.length > 0}
            openPane={openPane}
            remoteType={type}
            {...remote}
          />
        ))}
      </Tbody>
    </Table>
    {canLoadMore && (
      <Button
        label="Load 30 more..."
        btnStyle="success"
        onClick={handleLoadMore}
        big
      />
    )}
  </div>
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.remotes.fetch,
    }
  ),
  defaultProps({ query: { action: 'all', with_passwords: true } }),
  mapProps(({ params, ...rest }: Props): Props => ({
    type: params.type,
    params,
    ...rest,
  })),
  patch('load', ['query']),
  sync('meta'),
  withSort(
    ({ type }: Props): string => type,
    'remotes',
    sortDefaults.remote
  ),
  withLoadMore('remotes', 'remotes', true, 50),
  withPane(ConnectionPane, ['type'], null, 'connections'),
  withModal(),
  withHandlers({
    handleAddClick: ({ openModal, closeModal, type }: Props): Function => () => {
      openModal(
        <ManageModal
          onClose={closeModal}
          remoteType={type}
        />
      );
    },
  }),
  queryControl('search'),
  pure([
    'location',
    'remotes',
    'paneId',
    'sortData',
  ])
)(ConnectionTable);
