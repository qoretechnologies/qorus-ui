/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import PermsRow from './row';
import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../../components/new_table';
import { sortDefaults } from '../../../../constants/sort';
import Pull from '../../../../components/Pull';
import LoadMore from '../../../../components/LoadMore';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { DescriptionColumnHeader } from '../../../../components/DescriptionColumn';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import { Control as Button } from '../../../../components/controls';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import EnhancedTable from '../../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../../components/EnhancedTable';

type Props = {
  perms: Array<Object>,
  onEditClick: Function,
  onDeleteClick: Function,
  canEdit: boolean,
  canDelete: boolean,
  canAdd: boolean,
  onAddPermClick: Function,
};

const PermsTable: Function = ({
  perms,
  canAdd,
  onAddPermClick,
  ...rest
}: Props): React.Element<Table> => (
  <EnhancedTable
    collection={perms}
    tableId="rbacPerms"
    sortDefault={sortDefaults.rbacPerms}
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
                  disabled={!canAdd}
                  iconName="plus"
                  text="Add permission"
                  onClick={onAddPermClick}
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
            <NameColumnHeader />
            <ActionColumnHeader />
            <Th
              className="text normal"
              name="permission_type"
              iconName="info-sign"
            >
              Type
            </Th>
            <DescriptionColumnHeader />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(collection) === 0} cols={4}>
          {props => (
            <Tbody {...props}>
              {collection.map(
                (role: Object, index: number): React.Element<PermsRow> => (
                  <PermsRow
                    first={index === 0}
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

export default compose(pure(['perms']))(PermsTable);
