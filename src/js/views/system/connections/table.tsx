/* @flow */
import { Button } from '@blueprintjs/core';
import { useReqoreProperty } from '@qoretechnologies/reqore';
import capitalize from 'lodash/capitalize';
import size from 'lodash/size';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import Pull from '../../../components/Pull';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../components/new_table';
import { ADD_PERMS_MAP, DELETE_PERMS_MAP, EDIT_PERMS_MAP } from '../../../constants/remotes';
import { sortDefaults } from '../../../constants/sort';
import { findBy } from '../../../helpers/search';
import { hasPermission } from '../../../helpers/user';
import titleManager from '../../../hocomponents/TitleManager';
import withLoadMore from '../../../hocomponents/loadMore';
import withModal from '../../../hocomponents/modal';
import withPane from '../../../hocomponents/pane';
import queryControl from '../../../hocomponents/queryControl';
import withSort from '../../../hocomponents/sort';
import viewBehindPermission from '../../../hocomponents/viewBehindPermission';
import ManageModal from './modals/manage';
import ConnectionPane from './pane';
import ConnectionRow from './row';

type Props = {
  location: any;
  load: Function;
  remotes: Array<Object>;
  updateDone: Function;
  handleHighlightEnd: Function;
  paneId: string;
  openPane: Function;
  closePane: Function;
  sortData: any;
  onSortChange: Function;
  params: any;
  type: string;
  canLoadMore?: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  limit: number;
  handleAddClick: Function;
  openModal: Function;
  closeModal: Function;
  manage: Function;
  perms: Array<string>;
  canDelete: boolean;
  canAdd: boolean;
  canEdit: boolean;
  searchQuery?: string;
  remoteType: string;
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
  const addModal = useReqoreProperty('addModal');
  const closeModal = useReqoreProperty('removeModal');

  return (
    <Table fixed striped id="connections-view">
      <Thead>
        <FixedRow className="toolbar-row">
          <Th colspan="full">
            <Pull>
              <Button
                disabled={!canAdd}
                // @ts-ignore ts-migrate(2322) FIXME: Type 'Function' is not assignable to type '((event... Remove this comment to see the full error message
                onClick={() => handleAddClick(addModal, closeModal)}
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
          <NameColumnHeader title={intl.formatMessage({ id: 'table.name' })} icon="application" />
          <Th icon="build" className="huge">
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
        {(props) => (
          <Tbody {...props}>
            {/* @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message */}
            {remotes.map((remote: any, index: number) => (
              <ConnectionRow
                first={index === 0}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                key={remote.name}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                isActive={remote.name === paneId}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'alerts' does not exist on type 'Object'.
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
};

export default compose(
  viewBehindPermission(
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '(props: any) => string[]' is not... Remove this comment to see the full error message
    (props) => {
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
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('search'),
  mapProps(
    ({ type, perms, remotes, searchQuery, ...rest }: Props): Props => ({
      remotes: findBy(
        ['name', 'url', 'desc', 'options', 'type', 'status', 'user', 'db', 'pass'],
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
  withModal(),
  withHandlers({
    handleAddClick:
      ({ type }: Props): Function =>
      (openModal, closeModal) => {
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        openModal(<ManageModal onClose={closeModal} remoteType={type} />);
      },
    handleEditClick:
      ({ openModal, closeModal, type }: Props): Function =>
      (remote) => {
        // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
        openModal(<ManageModal onClose={closeModal} remoteType={type} edit {...remote} />);
      },
  }),
  withPane(
    ConnectionPane,
    ['remoteType', 'canEdit', 'canDelete', 'handleEditClick'],
    'detail',
    'connections'
  ),
  titleManager(
    // @ts-ignore ts-migrate(2345) FIXME: Argument of type '({ remoteType }: Props) => strin... Remove this comment to see the full error message
    ({ remoteType }: Props): string => `${capitalize(remoteType)} connections`
  ),
  pure(['location', 'remotes', 'paneId', 'sortData']),
  injectIntl
)(ConnectionTable);
