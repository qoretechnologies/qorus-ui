/* @flow */
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { ActionColumnHeader } from '../../../components/ActionColumn';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button } from '../../../components/controls';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import EnhancedTable from '../../../components/EnhancedTable';
import ExpandableItem from '../../../components/ExpandableItem';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import CacheRow from './row';

type Props = {
  name: string;
  data: any;
  dataLen: number;
  onClick: Function;
  onSingleClick: Function;
  expanded: boolean;
  handleExpandClick: Function;
  setExpanded: Function;
};

const SQLCacheTable: Function = ({
  name,
  data,
  onClick,
  onSingleClick,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => {
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
                    <Search resource="sqlcache" onSearchUpdate={handleSearchChange} />
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
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    key={cache.name}
                    datasource={name}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                    name={cache.name}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'count' does not exist on type 'Object'.
                    count={cache.count}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'created' does not exist on type 'Object'... Remove this comment to see the full error message
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
