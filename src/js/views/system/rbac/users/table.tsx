/* @flow */
import size from 'lodash/size';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import { Control as Button, Controls as ButtonGroup } from '../../../../components/controls';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import type { EnhancedTableProps } from '../../../../components/EnhancedTable';
import EnhancedTable from '../../../../components/EnhancedTable';
import LoadMore from '../../../../components/LoadMore';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../../components/new_table';
import Pull from '../../../../components/Pull';
import { sortDefaults } from '../../../../constants/sort';
import UsersRow from './row';

type Props = {
  users: Array<Object>;
  onEditClick: Function;
  canEdit: boolean;
  onDeleteClick: Function;
  onSortChange: Function;
  sortData: any;
  canDelete: boolean;
  onAddUserClick: Function;
  canAdd: boolean;
  rbacExternal: Array<Object>;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <EnhancedTable collection={users} sortDefault={sortDefaults.rbacUsers} tableId="rbacUsers">
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
      <Table condensed striped fixed id="rbac-view">
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
            <Th className="text" name="username" icon="user">
              Username
            </Th>
            <Th className="text" icon="contrast">
              Roles
            </Th>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(collection) === 0} cols={4}>
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (user: any, index: number) => (
                  <UsersRow
                    first={index === 0}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
