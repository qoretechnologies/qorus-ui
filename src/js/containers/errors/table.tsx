/* @flow */
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { ActionColumnHeader } from '../../components/ActionColumn';
import { Control as Button, Controls as ButtonGroup } from '../../components/controls';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { DescriptionColumnHeader } from '../../components/DescriptionColumn';
import type { EnhancedTableProps } from '../../components/EnhancedTable';
import EnhancedTable from '../../components/EnhancedTable';
import LoadMore from '../../components/LoadMore';
import { NameColumnHeader } from '../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../components/new_table';
import Pull from '../../components/Pull';
import { sortDefaults } from '../../constants/sort';
import Search from '../search';
import ErrorRow from './row';

type Props = {
  type: string;
  data: Array<Object>;
  compact?: boolean;
  onEditClick: Function;
  onDeleteClick: Function;
  onCreateClick: Function;
  height: string | number;
};

const ErrorsTable: Function = ({
  data,
  compact,
  type,
  onEditClick,
  onDeleteClick,
  onCreateClick,
  height,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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
                  <Button text="Add error" icon="plus" onClick={onCreateClick} big />
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
                  <Search onSearchUpdate={handleSearchChange} resource={`${type}Errors`} />
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
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
                (error: any, index: number) => (
                  <ErrorRow
                    first={index === 0}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Object'.
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
