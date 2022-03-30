/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import RolesRow from './row';
import {
  Table,
  Tbody,
  Thead,
  Th,
  FixedRow,
} from '../../../../components/new_table';
import { sortDefaults } from '../../../../constants/sort';
import Pull from '../../../../components/Pull';
import LoadMore from '../../../../components/LoadMore';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button } from '../../../../components/controls';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { DescriptionColumnHeader } from '../../../../components/DescriptionColumn';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import EnhancedTable from '../../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../../components/EnhancedTable';

type Props = {
  roles: Array<Object>,
  canCreate: boolean,
  onAddRoleClick: Function,
};

const RolesTable: Function = ({
  roles,
  onAddRoleClick,
  ...rest
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<Table> => (
  <EnhancedTable
    collection={roles}
    tableId="rbacRoles"
    sortDefault={sortDefaults.rbacRoles}
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
      <Table striped condensed fixed>
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
          {props => (
            <Tbody {...props}>
              {collection.map(
                // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (role: Object, index: number): React.Element<RolesRow> => (
                  <RolesRow
                    first={index === 0}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
