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
import { injectIntl, FormattedMessage } from 'react-intl';

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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Table fixed striped>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan="full">
          <Pull>
            <Button
              disabled={!canAdd}
              // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
              onClick={handleAddClick}
              icon="add"
              text={intl.formatMessage({ id: 'button.add-new' })}
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
        <Th name="up" icon="info-sign">
          <FormattedMessage id="table.status" />
        </Th>
        <NameColumnHeader
          title={intl.formatMessage({ id: 'table.name' })}
          icon="application"
        />
        <Th icon="build">
          <FormattedMessage id="table.actions" />
        </Th>
        <Th className="text" name="url" icon="link">
          <FormattedMessage id="table.url" />
        </Th>
        <Th className="text" name="desc" icon="label">
          <FormattedMessage id="table.description" />
        </Th>
        <Th icon="lock" name="locked">
          <FormattedMessage id="table.locked" />
        </Th>
        <Th icon="repeat" name="loopback">
          <FormattedMessage id="table.loopback" />
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={!remotes || size(remotes) === 0} cols={7}>
      {props => (
        <Tbody {...props}>
          { /* @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message */ }
          {remotes.map((remote: Object, index: number): React.Element<any> => (
            <ConnectionRow
              first={index === 0}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              key={remote.name}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              isActive={remote.name === paneId}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type 'Object'.
              hasAlerts={remote.alerts.length > 0}
              openPane={openPane}
              closePane={closePane}
              remoteType={type}
              canDelete={canDelete}
              canEdit={canEdit}
              {...remote}
            />
          ))}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  viewBehindPermission(
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '(props: any) => string[]' is not... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  mapProps(({ type, perms, remotes, searchQuery, ...rest }: Props): Props => ({
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
  })),
  withSort(({ type }: Props): string => type, 'remotes', sortDefaults.remote),
  withLoadMore('remotes', null, true, 50),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 5 arguments, but got 4.
  withPane(
    ConnectionPane,
    ['remoteType', 'canEdit', 'canDelete'],
    'detail',
    'connections'
  ),
  withModal(),
  withHandlers({
    handleAddClick: ({
      openModal,
      closeModal,
      type,
    }: Props): Function => () => {
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      openModal(<ManageModal onClose={closeModal} remoteType={type} />);
    },
  }),
  titleManager(
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ remoteType }: Props) => strin... Remove this comment to see the full error message
    ({ remoteType }: Props): string => `${capitalize(remoteType)} connections`
  ),
  pure(['location', 'remotes', 'paneId', 'sortData']),
  injectIntl
)(ConnectionTable);
