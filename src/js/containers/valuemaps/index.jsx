/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import { Table, Tbody, Thead, Th, FixedRow } from '../../components/new_table';
import { sortDefaults } from '../../constants/sort';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import EnhancedTable from '../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../components/EnhancedTable';
import Pull from '../../components/Pull';
import LoadMore from '../../components/LoadMore';
import Search from '../search';
import ValueMapsRow from './row';
import { IdColumnHeader } from '../../components/IdColumn';
import { NameColumnHeader } from '../../components/NameColumn';
import { AuthorColumnHeader } from '../../components/AuthorColumn';
import { DateColumnHeader } from '../../components/DateColumn';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import { FormattedMessage } from 'react-intl';

const ValueMapsTable = ({
  vmaps,
  compact: compact = true,
  paneId,
  openPane,
  closePane,
}: {
  vmaps: Array<Object>,
  compact: boolean,
  paneId?: number,
  openPane: Function,
  closePane: Function,
}) => (
  <EnhancedTable
    collection={vmaps}
    tableId="valuemaps"
    sortDefault={sortDefaults.valuemaps}
    searchBy={['name', 'desc', 'author', 'valuetype', 'mapsize']}
  >
    {({
      handleSearchChange,
      handleLoadAll,
      handleLoadMore,
      loadMoreCurrent,
      loadMoreTotal,
      limit,
      collection,
      canLoadMore,
      sortData,
      onSortChange,
    }: EnhancedTableProps) => (
      <Table fixed condensed striped>
        <Thead>
          {compact || canLoadMore ? (
            <FixedRow className="toolbar-row">
              <Th>
                <Pull right>
                  <LoadMore
                    handleLoadAll={handleLoadAll}
                    handleLoadMore={handleLoadMore}
                    limit={limit}
                    currentCount={loadMoreCurrent}
                    total={loadMoreTotal}
                    canLoadMore={canLoadMore}
                  />
                  {compact && (
                    <Search
                      onSearchUpdate={handleSearchChange}
                      resource="valuemaps"
                    />
                  )}
                </Pull>
              </Th>
            </FixedRow>
          ) : null}
          <FixedRow {...{ onSortChange, sortData }}>
            <IdColumnHeader />
            <NameColumnHeader />
            {!compact && <Th icon="download">Dump</Th>}
            <Th className="narrow" name="mapsize" icon="info-sign">
              <FormattedMessage id='table.mapsize' />
            </Th>
            <Th
              classname="narrow"
              name="throws_exception"
              icon="warning-sign"
            >
              <FormattedMessage id='table.throws' />
            </Th>
            <Th className="narrow" name="valuetype" icon="code">
              <FormattedMessage id='table.type' />
            </Th>
            {!compact && <AuthorColumnHeader />}
            {!compact && <DateColumnHeader />}
            {!compact && (
              <DateColumnHeader name="modified">
                <FormattedMessage id='table.modified' />
              </DateColumnHeader>
            )}
            {!compact && <DescriptionColumnHeader name="description" />}
          </FixedRow>
        </Thead>
        <DataOrEmptyTable
          condition={!collection || size(collection) === 0}
          cols={compact ? 5 : 10}
        >
          {props => (
            <Tbody {...props}>
              {collection.map(
                (item: Object, index: number): React.Element<any> => (
                  <ValueMapsRow
                    key={item.id}
                    first={index === 0}
                    data={item}
                    isActive={parseInt(paneId, 10) === item.id}
                    openPane={openPane}
                    closePane={closePane}
                    compact={compact}
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

export default compose(pure(['vmaps', 'paneId']))(ValueMapsTable);
