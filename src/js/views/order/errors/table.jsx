// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../../components/new_table';
import Pull from '../../../components/Pull';
import CsvControl from '../../../components/CsvControl';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import EnhancedTable from '../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import LoadMore from '../../../components/LoadMore';
import Search from '../../../containers/search';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import {
  DescriptionColumnHeader,
  DescriptionColumn,
} from '../../../components/DescriptionColumn';
import { DateColumnHeader, DateColumn } from '../../../components/DateColumn';

type Props = {
  errors: Array<Object>,
  onCSVClick: Function,
};

const ErrorsTable: Function = ({
  errors,
  onCSVClick,
}: Props): React.Element<Table> => (
  <EnhancedTable
    collection={errors}
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
      <Table condensed striped fixed>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th colspan="full">
              <Pull>
                <CsvControl
                  onClick={onCSVClick}
                  disabled={size(collection) === 0}
                />
              </Pull>
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  onLoadMore={handleLoadMore}
                  onLoadAll={handleLoadAll}
                  limit={limit}
                />
                <Search
                  onSearchUpdate={handleSearchChange}
                  resource="orderErrors"
                />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <NameColumnHeader title="Error code" name="error" icon="error" />
            <NameColumnHeader title="Step Name" name="step_name" />
            <Th icon="info-sign" name="severity">
              Severity
            </Th>
            <Th icon="error" name="error_type">
              Error Type
            </Th>
            <Th icon="refresh" name="retry">
              Retry
            </Th>
            <Th icon="info-sign" name="ind">
              Ind
            </Th>
            <DescriptionColumnHeader name="info">Info</DescriptionColumnHeader>
            <DescriptionColumnHeader name="description" />
            <DateColumnHeader />
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={collection.length === 0} cols={9}>
          {props => (
            <Tbody {...props}>
              {collection.map(
                (error: Object, index: number): React.Element<any> => (
                  <Tr key={index} first={index === 0}>
                    <NameColumn name={error.error} />
                    <NameColumn name={error.step_name} />
                    <Td className="medium">{error.severity}</Td>
                    <Td className="medium">{error.error_type}</Td>
                    <Td className="medium">{error.retry}</Td>
                    <Td className="narrow">{error.retry}</Td>
                    <DescriptionColumn>{error.info}</DescriptionColumn>
                    <DescriptionColumn>{error.description}</DescriptionColumn>
                    <DateColumn>{error.created}</DateColumn>
                  </Tr>
                )
              )}
            </Tbody>
          )}
        </DataOrEmptyTable>
      </Table>
    )}
  </EnhancedTable>
);

export default pure(['collection', 'steps', 'limit'])(ErrorsTable);
