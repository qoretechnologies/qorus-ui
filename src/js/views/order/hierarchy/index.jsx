// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import map from 'lodash/map';
import size from 'lodash/size';
import {
  Table,
  Tbody,
  Thead,
  FixedRow,
  Th,
} from '../../../components/new_table';
import HierarchyRow from './row';
import Pull from '../../../components/Pull';
import LoadMore from '../../../components/LoadMore';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import EnhancedTable from '../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import { NameColumnHeader } from '../../../components/NameColumn';
import { DateColumnHeader } from '../../../components/DateColumn';
import { IdColumnHeader } from '../../../components/IdColumn';

type Props = {
  hierarchy: Object,
  hierarchyKeys: Array<string | number>,
  compact?: boolean,
  expanded: Object,
  order: Object,
  toggleRow: Function,
  handleExpandClick: Function,
  canLoadMore: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  isTablet: boolean,
  loadMoreTotal: number,
  limit: number,
};

const HierarchyTable: Function = ({
  hierarchy,
  compact,
}: Props): React.Element<any> => (
  <EnhancedTable
    collection={hierarchy}
    tableId="orderErrors"
    searchBy={[
      'severity',
      'error',
      'step_name',
      'ind',
      'created',
      'error_type',
      'retry',
      'info',
      'description',
    ]}
    sortDefault={sortDefaults.orderErrors}
  >
    {({
      handleSearchChange,
      handleLoadAll,
      handleLoadMore,
      limit,
      collection,
      canLoadMore,
      sortData,
      onSortChange,
    }: EnhancedTableProps) => (
      <Table fixed condensed striped height={compact ? 300 : undefined}>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th colspan="full">
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  handleLoadMore={handleLoadMore}
                  handleLoadAll={handleLoadAll}
                  limit={limit}
                />
                <Search
                  onSearchUpdate={handleSearchChange}
                  resource="hierarchy"
                />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <IdColumnHeader />
            <NameColumnHeader title="Workflow" />
            <Th iconName="info-sign" name="workflowstatus">
              Status
            </Th>
            <Th iconName="tree-diagram" name="hierarchy_level">
              Level
            </Th>
            <Th iconName="warning-sign" name="priority">
              Priority
            </Th>
            <Th iconName="error" name="business_error">
              Bus.Err.
            </Th>
            {!compact && (
              <Th iconName="error" name="error_count">
                Errors
              </Th>
            )}
            {!compact && (
              <Th iconName="warning-sign" name="warning_count">
                Warnings
              </Th>
            )}
            {!compact && (
              <Th iconName="exchange" name="subworkflow">
                Sub WF
              </Th>
            )}
            {!compact && (
              <Th iconName="refresh" name="synchronous">
                Sync
              </Th>
            )}
            {!compact && (
              <DateColumnHeader name="scheduled">Scheduled</DateColumnHeader>
            )}
            {!compact && (
              <DateColumnHeader name="started">Started</DateColumnHeader>
            )}
            {!compact && (
              <DateColumnHeader name="completed">Completed</DateColumnHeader>
            )}
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={size(hierarchy) === 0}
          cols={compact ? 5 : 12}
          small={compact}
        >
          {props => (
            <Tbody {...props}>
              {collection.map(
                (item: Object, index: number): ?React.Element<any> => (
                  <HierarchyRow
                    key={item.id}
                    first={index === 0}
                    id={item.workflow_instanceid}
                    compact={compact}
                    item={item}
                    hasParent={item.parent_workflow_instanceId}
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

export default compose(
  mapProps(
    ({ order, ...rest }: Props): Object => ({
      hierarchy: order.HierarchyInfo
        ? map(order.HierarchyInfo, (hierarchy: Object, id: number) => ({
            ...hierarchy,
            id,
          }))
        : [],
      ...rest,
    })
  ),
  pure(['hierarchy', 'isTablet'])
)(HierarchyTable);
