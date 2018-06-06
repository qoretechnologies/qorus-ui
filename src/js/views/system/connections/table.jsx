/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { withRouter } from 'react-router';
import { Button, Intent } from '@blueprintjs/core';

import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../components/new_table';
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
import Toolbar from '../../../components/toolbar';
import {
  CONN_MAP,
  ADD_PERMS_MAP,
  DELETE_PERMS_MAP,
  EDIT_PERMS_MAP,
} from '../../../constants/remotes';
import Search from '../../../containers/search';
import queryControl from '../../../hocomponents/queryControl';
import { findBy } from '../../../helpers/search';
import { hasPermission } from '../../../helpers/user';

type Props = {
  location: Object,
  load: Function,
  remotes: Array<Object>,
  updateDone: Function,
  handleHighlightEnd: Function,
  paneId: string,
  openPane: Function,
  closePane: Function,
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
  perms: Array<string>,
  canDelete: boolean,
  canAdd: boolean,
  canEdit: boolean,
};

const remotesSelector: Function = (state: Object, props: Object): Array<*> =>
  state.api.remotes.data.filter(
    a => a.conntype.toLowerCase() === CONN_MAP[props.type].toLowerCase()
  );

const filterRemotes: Function = (query: string): Function => (
  remotes: Array<Object>
) =>
  findBy(
    ['name', 'url', 'desc', 'options', 'type', 'status', 'user', 'db', 'pass'],
    query,
    remotes
  );

const filteredRemotes: Function = createSelector(
  [remotesSelector, querySelector('search')],
  (remotes: Array<Object>, query: ?string): Array<Object> =>
    filterRemotes(query)(remotes)
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('remotes'),
    filteredRemotes,
    resourceSelector('currentUser'),
  ],
  (meta, remotes, currentUser) => ({
    meta,
    perms: currentUser.data.permissions,
    remotes,
  })
);

const ConnectionTable: Function = ({
  sortData,
  onSortChange,
  paneId,
  openPane,
  closePane,
  remotes,
  type,
  canLoadMore,
  handleLoadMore,
  handleAddClick,
  searchQuery,
  changeSearchQuery,
  canDelete,
  canAdd,
}: Props): React.Element<any> => (
  <div>
    <Toolbar marginBottom>
      {canAdd && (
        <Button
          onClick={handleAddClick}
          intent={Intent.PRIMARY}
          iconName="add"
          text="Add new"
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
      striped
      key={`${type}-${remotes.length}`}
      marginBottom={canLoadMore ? 40 : 0}
    >
      <Thead>
        <FixedRow sortData={sortData} onSortChange={onSortChange}>
          <Th className="normal" name="up">
            Status
          </Th>
          <Th className="narrow">-</Th>
          {canDelete && <Th className="narrow">Delete</Th>}
          <Th className="tiny">
            <Icon icon="exclamation-triangle" />
          </Th>
          <Th className="name" name="name">
            Name
          </Th>
          {type === 'datasources' ? (
            <Th className="text">Options</Th>
          ) : (
            <Th className="text" name="url">
              URL
            </Th>
          )}
          <Th className="text" name="desc">
            Description
          </Th>
          <Th className="normal">-</Th>
        </FixedRow>
      </Thead>
      <Tbody>
        {remotes.map(
          (remote: Object, index: number): React.Element<any> => (
            <ConnectionRow
              first={index === 0}
              key={`connection_${remote.name}`}
              isActive={remote.name === paneId}
              hasAlerts={remote.alerts.length > 0}
              openPane={openPane}
              closePane={closePane}
              remoteType={type}
              canDelete={canDelete}
              {...remote}
            />
          )
        )}
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
  withRouter,
  connect(
    viewSelector,
    {
      load: actions.remotes.fetch,
    }
  ),
  defaultProps({ query: { action: 'all', with_passwords: true } }),
  mapProps(
    ({ type, perms, ...rest }: Props): Props => ({
      remoteType: type,
      canDelete: hasPermission(perms, DELETE_PERMS_MAP[type], 'or'),
      canAdd: hasPermission(perms, ADD_PERMS_MAP[type], 'or'),
      canEdit: hasPermission(perms, EDIT_PERMS_MAP[type], 'or'),
      perms,
      type,
      ...rest,
    })
  ),
  patch('load', ['query']),
  sync('meta'),
  withSort(({ type }: Props): string => type, 'remotes', sortDefaults.remote),
  withLoadMore('remotes', 'remotes', true, 50),
  withPane(ConnectionPane, ['remoteType', 'canEdit'], null, 'connections'),
  withModal(),
  withHandlers({
    handleAddClick: ({
      openModal,
      closeModal,
      type,
    }: Props): Function => () => {
      openModal(<ManageModal onClose={closeModal} remoteType={type} />);
    },
  }),
  queryControl('search'),
  pure(['location', 'remotes', 'paneId', 'sortData'])
)(ConnectionTable);
