/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import UsersRow from './row';
import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../../components/new_table';
import { sortDefaults } from '../../../../constants/sort';
import Pull from '../../../../components/Pull';
import {
  Control as Button,
  Controls as ButtonGroup,
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../../components/controls';
import LoadMore from '../../../../components/LoadMore';
import EnhancedTable from '../../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../../components/EnhancedTable';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import { NameColumnHeader } from '../../../../components/NameColumn';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import Alert from '../../../../components/alert';
import { Icon } from '@blueprintjs/core';

type Props = {
  users: Array<Object>,
  onEditClick: Function,
  canEdit: boolean,
  onDeleteClick: Function,
  onSortChange: Function,
  sortData: Object,
  canDelete: boolean,
  onAddUserClick: Function,
  canAdd: boolean,
  rbacExternal: Array<Object>,
};

const UsersTable: Function = ({
  users,
  onEditClick,
  onDeleteClick,
  canEdit,
  canDelete,
  onAddUserClick,
  canAdd,
  rbacExternal,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<Table> => (
  <EnhancedTable
    collection={users}
    sortDefault={sortDefaults.rbacUsers}
    tableId="rbacUsers"
  >
    {({
      canLoadMore,
      handleLoadAll,
      handleLoadMore,
      loadMoreCurrent,
      loadMoreTotal,
      limit,
      sortData,
      onSortChange,
      collection,
    }: EnhancedTableProps) => (
      <Table consensed striped fixed>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th collspan="full">
              <Pull>
                <ButtonGroup>
                  <Button
                    disabled={!canAdd}
                    text="Add user"
                    icon="plus"
                    onClick={onAddUserClick}
                    big
                  />
                </ButtonGroup>
                {rbacExternal && (
                  <ButtonGroup>
                    <Button
                      className="bp3-minimal"
                      icon="warning-sign"
                      btnStyle="warning"
                      title={`External RBAC providers are: ${rbacExternal}`}
                      text="Only users stored in Qorus system DB are manageable in this
                    area"
                      big
                    />
                  </ButtonGroup>
                )}
              </Pull>
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  onLoadMore={handleLoadMore}
                  onLoadAll={handleLoadAll}
                  currentCount={loadMoreCurrent}
                  total={loadMoreTotal}
                  limit={limit}
                />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ onSortChange, sortData }}>
            <NameColumnHeader />
            <ActionColumnHeader />
            <Th className="text big" name="username" icon="user">
              Username
            </Th>
            <Th className="text" icon="contrast">
              Roles
            </Th>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(collection) === 0} cols={4}>
          {props => (
            <Tbody {...props}>
              {collection.map(
                // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (user: Object, index: number): React.Element<any> => (
                  <UsersRow
                    first={index === 0}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    key={user.name}
                    model={user}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                  />
                )
              )}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    )}
  </EnhancedTable>
);

export default compose(pure(['users']))(UsersTable);
