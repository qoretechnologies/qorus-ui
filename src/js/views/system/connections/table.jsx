/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { withRouter } from 'react-router';
import { Button } from '@blueprintjs/core';
import titleManager from '../../../hocomponents/TitleManager';
import capitalize from 'lodash/capitalize';
import size from 'lodash/size';

import {
  Table,
  Tbody,
  Thead,
  Th,
  FixedRow,
} from '../../../components/new_table';
import withSort from '../../../hocomponents/sort';
import withLoadMore from '../../../hocomponents/loadMore';
import { sortDefaults } from '../../../constants/sort';
import withPane from '../../../hocomponents/pane';
import withModal from '../../../hocomponents/modal';
import ConnectionPane from './pane';
import ConnectionRow from './row';
import ManageModal from './modals/manage';
import {
  ADD_PERMS_MAP,
  DELETE_PERMS_MAP,
  EDIT_PERMS_MAP,
} from '../../../constants/remotes';
import { findBy } from '../../../helpers/search';
import { hasPermission } from '../../../helpers/user';
import Pull from '../../../components/Pull';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import queryControl from '../../../hocomponents/queryControl';
import viewBehindPermission from '../../../hocomponents/viewBehindPermission';

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
  loadMoreCurrent: number,
  loadMoreTotal: number,
  limit: number,
  handleAddClick: Function,
  openModal: Function,
  closeModal: Function,
  manage: Function,
  perms: Array<string>,
  canDelete: boolean,
  canAdd: boolean,
  canEdit: boolean,
  searchQuery?: string,
  remoteType: string,
};

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
  loadMoreCurrent,
  loadMoreTotal,
  limit,
  handleAddClick,
  canDelete,
  canAdd,
  canEdit,
}: Props): React.Element<any> => (
  <Table fixed striped>
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
              currentCount={loadMoreCurrent}
              total={loadMoreTotal}
              limit={limit}
            />
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <Th name="up" iconName="info-sign">
          Status
        </Th>
        <NameColumnHeader iconName="application" />
        <Th iconName="build">Actions</Th>
        <Th className="text" name="url" iconName="link">
          URL
        </Th>
        <Th className="text" name="desc" iconName="label">
          Description
        </Th>
        <Th iconName="lock" name="locked">
          Locked
        </Th>
        <Th iconName="repeat" name="loopback">
          Loopback
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={!remotes || size(remotes) === 0} cols={7}>
      {props => (
        <Tbody {...props}>
          {remotes.map(
            (remote: Object, index: number): React.Element<any> => (
              <ConnectionRow
                first={index === 0}
                key={remote.name}
                isActive={remote.name === paneId}
                hasAlerts={remote.alerts.length > 0}
                openPane={openPane}
                closePane={closePane}
                remoteType={type}
                canDelete={canDelete}
                canEdit={canEdit}
                {...remote}
              />
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  viewBehindPermission(
    props => {
      if (props.type === 'qorus') {
        return ['READ-SERVER-CONNECTION', 'SERVER-CONNECTION-CONTROL'];
      } else if (props.type === 'user') {
        return ['READ-USER-CONNECTION', 'USER-CONNECTION-CONTROL'];
      }

      return null;
    },
    'or',
    true
  ),
  withRouter,
  queryControl('search'),
  mapProps(
    ({ type, perms, remotes, searchQuery, ...rest }: Props): Props => ({
      remotes: findBy(
        [
          'name',
          'url',
          'desc',
          'options',
          'type',
          'status',
          'user',
          'db',
          'pass',
        ],
        searchQuery,
        remotes
      ),
      remoteType: type,
      canDelete: hasPermission(perms, DELETE_PERMS_MAP[type], 'or'),
      canAdd: hasPermission(perms, ADD_PERMS_MAP[type], 'or'),
      canEdit: hasPermission(perms, EDIT_PERMS_MAP[type], 'or'),
      perms,
      type,
      ...rest,
    })
  ),
  withSort(({ type }: Props): string => type, 'remotes', sortDefaults.remote),
  withLoadMore('remotes', null, true, 50),
  withPane(ConnectionPane, ['remoteType', 'canEdit'], 'detail', 'connections'),
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
