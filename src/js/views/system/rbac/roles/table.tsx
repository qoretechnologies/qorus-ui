import size from 'lodash/size';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button } from '../../../../components/controls';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import { DescriptionColumnHeader } from '../../../../components/DescriptionColumn';
import type { EnhancedTableProps } from '../../../../components/EnhancedTable';
import EnhancedTable from '../../../../components/EnhancedTable';
import LoadMore from '../../../../components/LoadMore';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../../components/new_table';
import Pull from '../../../../components/Pull';
import { sortDefaults } from '../../../../constants/sort';
import RolesRow from './row';

type Props = {
  roles: Array<Object>;
  canCreate: boolean;
  onAddRoleClick: Function;
};

const RolesTable: Function = ({
  roles,
  onAddRoleClick,
  ...rest
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <EnhancedTable collection={roles} tableId="rbacRoles" sortDefault={sortDefaults.rbacRoles}>
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
      <Table striped condensed fixed id="rbac-view">
        <Thead>
          <FixedRow className="toolbar-row">
            <Th colspan="full">
              <Pull>
                <Button
                  disabled={!rest.canCreate}
                  text="Add role"
                  icon="plus"
                  onClick={onAddRoleClick}
                  big
                />
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
            <NameColumnHeader name="role" />
            <ActionColumnHeader />
            <Th className="text" name="provider" icon="database">
              Provider
            </Th>
            <DescriptionColumnHeader />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(collection) === 0} cols={4}>
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (role: any, index: number) => (
                  <RolesRow
                    first={index === 0}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    key={role.name}
                    model={role}
                    {...rest}
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

export default compose(pure(['roles']))(RolesTable);
