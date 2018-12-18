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
import { Control as Button } from '../../../../components/controls';
import LoadMore from '../../../../components/LoadMore';
import EnhancedTable from '../../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../../components/EnhancedTable';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import { NameColumnHeader } from '../../../../components/NameColumn';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';

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
};

const UsersTable: Function = ({
  users,
  onEditClick,
  onDeleteClick,
  canEdit,
  canDelete,
  onAddUserClick,
  canAdd,
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
                <Button
                  disabled={!canAdd}
                  text="Add user"
                  iconName="plus"
                  onClick={onAddUserClick}
                  big
                />
              </Pull>
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  onLoadMore={handleLoadMore}
                  onLoadAll={handleLoadAll}
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
                (user: Object, index: number): React.Element<any> => (
                  <UsersRow
                    first={index === 0}
                    key={index}
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
