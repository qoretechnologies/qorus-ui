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
import { Button, Icon } from '@blueprintjs/core';
import titleManager from '../../../hocomponents/TitleManager';
import capitalize from 'lodash/capitalize';

import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../components/new_table';
import sync from '../../../hocomponents/sync';
import patch from '../../../hocomponents/patchFuncArgs';
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
import {
  CONN_MAP,
  ADD_PERMS_MAP,
  DELETE_PERMS_MAP,
  EDIT_PERMS_MAP,
} from '../../../constants/remotes';
import { findBy } from '../../../helpers/search';
import { hasPermission } from '../../../helpers/user';
import Pull from '../../../components/Pull';
import LoadMore from '../../../components/LoadMore';
import { AlertColumnHeader } from '../../../components/AlertColumn';
import { NameColumnHeader } from '../../../components/NameColumn';

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
  handleLoadAll: Function,
  limit: number,
  handleAddClick: Function,
  openModal: Function,
  closeModal: Function,
  manage: Function,
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
  handleLoadAll,
  limit,
  handleAddClick,
  canDelete,
  canAdd,
}: Props): React.Element<any> => (
  <Table
    fixed
    striped
    key={`${type}-${remotes.length}`}
    marginBottom={canLoadMore ? 40 : 0}
  >
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan="full">
          <Pull>
            <Button
              disabled={!canAdd}
              onClick={handleAddClick}
              iconName="add"
              text="Add new"
            />
          </Pull>
          <Pull right>
            <LoadMore
              canLoadMore={canLoadMore}
              handleLoadMore={handleLoadMore}
              handleLoadAll={handleLoadAll}
              limit={limit}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th className="normal" name="up">
          Status
        </Th>
        <Th className="narrow">Actions</Th>
        <AlertColumnHeader name="has_alerts" />
        <NameColumnHeader />
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
        {type === 'qorus' && <Th className="normal">Loopback</Th>}
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
  titleManager(
    ({ remoteType }: Props): string => `${capitalize(remoteType)} connections`
  ),
  pure(['location', 'remotes', 'paneId', 'sortData'])
)(ConnectionTable);
