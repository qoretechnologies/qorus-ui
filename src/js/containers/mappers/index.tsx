/* @flow */
import React from 'react';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  FixedRow,
} from '../../components/new_table';
import { sortDefaults } from '../../constants/sort';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import EnhancedTable from '../../components/EnhancedTable';
import Pull from '../../components/Pull';
import LoadMore from '../../components/LoadMore';
import Search from '../../containers/search';
import type { EnhancedTableProps } from '../../components/EnhancedTable';
import { IdColumn, IdColumnHeader } from '../../components/IdColumn';
import NameColumn, { NameColumnHeader } from '../../components/NameColumn';
import { normalizeName } from '../../components/utils';
import { FormattedMessage } from 'react-intl';

const MappersTable = ({
  mappers,
}: {
  mappers: Array<Object>,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<any> => (
  <EnhancedTable
    collection={mappers}
    searchBy={['mapperid', 'name', 'version', 'type']}
    tableId="mappers"
    sortDefault={sortDefaults.mappers}
  >
    {({
      collection,
      sortData,
      onSortChange,
      handleSearchChange,
      limit,
      canLoadMore,
      handleLoadMore,
      handleLoadAll,
      loadMoreCurrent,
      loadMoreTotal,
    }: EnhancedTableProps) => (
      <Table condensed striped fixed>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th>
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  onLoadMore={handleLoadMore}
                  onLoadAll={handleLoadAll}
                  currentCount={loadMoreCurrent}
                  total={loadMoreTotal}
                  limit={limit}
                />
                <Search
                  onSearchUpdate={handleSearchChange}
                  resource="mappers"
                />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ onSortChange, sortData }}>
            <IdColumnHeader name="mapperid" />
            <NameColumnHeader />
            <Th className="text" name="type" icon="info-sign">
              <FormattedMessage id='table.type' />
            </Th>
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={!mappers || mappers.length === 0} cols={3}>
          {props => (
            <Tbody {...props}>
              {collection.map(
                // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (item: Object, index: number): React.Element<any> => (
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'mapperid' does not exist on type 'Object... Remove this comment to see the full error message
                  <Tr key={item.mapperid} first={index === 0}>
                    { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'mapperid' does not exist on type 'Object... Remove this comment to see the full error message */ }
                    <IdColumn>{item.mapperid}</IdColumn>
                    <NameColumn
                      name={normalizeName(item)}
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'mapperid' does not exist on type 'Object... Remove this comment to see the full error message
                      link={`/mappers/${item.mapperid}`}
                      type="mapper"
                    />
                    { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'. */ }
                    <Td className="text">{item.type}</Td>
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

export default compose(
  pure(['mappers'])
)(MappersTable);
