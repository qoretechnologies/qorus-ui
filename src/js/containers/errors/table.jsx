/* @flow */
import React from 'react';
import compose from 'recompose/compose';

import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import { NameColumnHeader } from '../../components/NameColumn';
import ErrorRow from './row';
import { sortDefaults } from '../../constants/sort';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import EnhancedTable from '../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../components/EnhancedTable';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Pull from '../../components/Pull';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import LoadMore from '../../components/LoadMore';
import Search from '../search';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import { ActionColumnHeader } from '../../components/ActionColumn';

type Props = {
  type: string,
  data: Array<Object>,
  compact?: boolean,
  onEditClick: Function,
  onDeleteClick: Function,
  onCreateClick: Function,
  height: string | number,
};

const ErrorsTable: Function = ({
  data,
  compact,
  type,
  onEditClick,
  onDeleteClick,
  onCreateClick,
  height,
}: Props): React.Element<any> => (
  <EnhancedTable
    collection={data}
    tableId="globalErrors"
    sortDefault={sortDefaults.globalErrors}
    searchBy={['error', 'severity', 'status', 'delay']}
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
      handleSearchChange,
    }: EnhancedTableProps) => (
      <Table striped condensed fixed height={height}>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th>
              <Pull>
                <ButtonGroup>
                  <Button
                    text="Add error"
                    icon="plus"
                    onClick={onCreateClick}
                    big
                  />
                </ButtonGroup>
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
                {compact && (
                  <Search
                    onSearchUpdate={handleSearchChange}
                    resource={`${type}Errors`}
                  />
                )}
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow sortData={sortData} onSortChange={onSortChange}>
            <NameColumnHeader name="error" />
            <ActionColumnHeader />
            {!compact && <DescriptionColumnHeader name="description" />}
            <Th name="severity" icon="warning-sign">
              Severity
            </Th>
            <Th name="status" icon="info-sign">
              Status
            </Th>
            <Th name="retry_delay_secs" icon="time">
              Delay
            </Th>
            <Th name="business_flag" icon="flag">
              Bus. Flag
            </Th>
            {type === 'workflow' && (
              <Th name="manually_updated" icon="edit">
                Updated
              </Th>
            )}
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={!collection || collection.length === 0}
          cols={type === 'workflow' ? (compact ? 7 : 8) : compact ? 6 : 7}
        >
          {props => (
            <Tbody {...props}>
              {collection.map(
                (error: Object, index: number): React.Element<ErrorRow> => (
                  <ErrorRow
                    first={index === 0}
                    key={error.error}
                    data={error}
                    compact={compact}
                    type={type}
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

export default compose(onlyUpdateForKeys(['data']))(ErrorsTable);
