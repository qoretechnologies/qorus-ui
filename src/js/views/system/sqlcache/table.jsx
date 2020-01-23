/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Tbody,
  Thead,
  Th,
  FixedRow,
} from '../../../components/new_table';
import CacheRow from './row';
import Pull from '../../../components/Pull';
import ExpandableItem from '../../../components/ExpandableItem';
import { Control as Button } from '../../../components/controls';
import { NameColumnHeader } from '../../../components/NameColumn';
import { ActionColumnHeader } from '../../../components/ActionColumn';
import EnhancedTable from '../../../components/EnhancedTable';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import { sortDefaults } from '../../../constants/sort';
import LoadMore from '../../../components/LoadMore';
import Search from '../../../containers/search';

type Props = {
  name: string,
  data: Object,
  dataLen: number,
  onClick: Function,
  onSingleClick: Function,
  expanded: boolean,
  handleExpandClick: Function,
  setExpanded: Function,
};

const SQLCacheTable: Function = ({
  name,
  data,
  onClick,
  onSingleClick,
}: Props): React.Element<any> => {
  const handleClick: Function = (): void => {
    onClick(name);
  };

  return (
    <ExpandableItem title={name} show>
      {() => (
        <EnhancedTable
          collection={data}
          searchBy={['name', 'count', 'created']}
          tableId={name}
          sortDefault={sortDefaults.sqlcache}
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
                <FixedRow className="toolbar-row">
                  <Pull>
                    <Button
                      text="Clear datasource"
                      icon="trash"
                      onClick={handleClick}
                      btnStyle="danger"
                      big
                    />
                  </Pull>
                  <Pull right>
                    <LoadMore
                      handleLoadAll={handleLoadAll}
                      handleLoadMore={handleLoadMore}
                      limit={limit}
                      currentCount={loadMoreCurrent}
                      total={loadMoreTotal}
                      canLoadMore={canLoadMore}
                    />
                    <Search
                      resource="sqlcache"
                      onSearchUpdate={handleSearchChange}
                    />
                  </Pull>
                </FixedRow>
                <FixedRow {...{ onSortChange, sortData }}>
                  <NameColumnHeader />
                  <ActionColumnHeader />
                  <Th name="count" icon="info-sign">
                    Count
                  </Th>
                  <Th icon="time" name="created">
                    Created
                  </Th>
                </FixedRow>
              </Thead>
              <Tbody>
                {collection.map((cache, index) => (
                  <CacheRow
                    first={index === 0}
                    key={cache.name}
                    datasource={name}
                    name={cache.name}
                    count={cache.count}
                    created={cache.created}
                    onClick={onSingleClick}
                  />
                ))}
              </Tbody>
            </Table>
          )}
        </EnhancedTable>
      )}
    </ExpandableItem>
  );
};

export default compose(pure(['data']))(SQLCacheTable);
