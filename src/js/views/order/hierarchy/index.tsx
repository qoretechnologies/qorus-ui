// @flow
import map from 'lodash/map';
import size from 'lodash/size';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { DateColumnHeader } from '../../../components/DateColumn';
import type { EnhancedTableProps } from '../../../components/EnhancedTable';
import EnhancedTable from '../../../components/EnhancedTable';
import { IdColumnHeader } from '../../../components/IdColumn';
import LoadMore from '../../../components/LoadMore';
import { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../components/new_table';
import Pull from '../../../components/Pull';
import { sortDefaults } from '../../../constants/sort';
import Search from '../../../containers/search';
import HierarchyRow from './row';

type Props = {
  hierarchy: any;
  hierarchyKeys: Array<string | number>;
  compact?: boolean;
  expanded: any;
  order: any;
  toggleRow: Function;
  handleExpandClick: Function;
  canLoadMore: boolean;
  handleLoadMore: Function;
  handleLoadAll: Function;
  isTablet: boolean;
  loadMoreTotal: number;
  limit: number;
};

const HierarchyTable: Function = ({
  hierarchy,
  compact,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <EnhancedTable
    collection={hierarchy}
    tableId="hierarchy"
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
    sortDefault={sortDefaults.hierarchy}
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
      <Table fixed condensed striped height={compact ? 300 : undefined}>
        <Thead>
          <FixedRow className="toolbar-row">
            <Th colspan="full">
              <Pull right>
                <LoadMore
                  canLoadMore={canLoadMore}
                  handleLoadMore={handleLoadMore}
                  handleLoadAll={handleLoadAll}
                  currentCount={loadMoreCurrent}
                  total={loadMoreTotal}
                  limit={limit}
                />
                <Search onSearchUpdate={handleSearchChange} resource="hierarchy" />
              </Pull>
            </Th>
          </FixedRow>
          <FixedRow {...{ sortData, onSortChange }}>
            <IdColumnHeader className="medium" />
            <NameColumnHeader title={intl.formatMessage({ id: 'table.workflow' })} />
            <Th icon="info-sign" name="workflowstatus">
              <FormattedMessage id="table.status" />
            </Th>
            <Th icon="diagram-tree" name="hierarchy_level">
              <FormattedMessage id="table.hierarchy-level" />
            </Th>
            <Th icon="warning-sign" name="priority">
              <FormattedMessage id="table.priority" />
            </Th>
            <Th icon="error" name="business_error">
              <FormattedMessage id="table.business-error" />
            </Th>
            {!compact && (
              <Th icon="issue" name="error_count">
                <FormattedMessage id="table.errors-count" />
              </Th>
            )}
            {!compact && (
              <Th icon="warning-sign" name="warning_count">
                <FormattedMessage id="table.warnings" />
              </Th>
            )}
            {!compact && (
              <Th icon="exchange" name="subworkflow">
                <FormattedMessage id="table.is-subworkflow" />
              </Th>
            )}
            {!compact && (
              <Th icon="refresh" name="synchronous">
                <FormattedMessage id="table.is-synchronous" />
              </Th>
            )}
            {!compact && (
              <DateColumnHeader name="scheduled">
                <FormattedMessage id="table.scheduled" />
              </DateColumnHeader>
            )}
            {!compact && (
              <DateColumnHeader name="started">
                <FormattedMessage id="table.started" />
              </DateColumnHeader>
            )}
            {!compact && (
              <DateColumnHeader name="completed">
                <FormattedMessage id="table.completed" />
              </DateColumnHeader>
            )}
          </FixedRow>
        </Thead>
        <DataOrEmptyTable condition={size(hierarchy) === 0} cols={compact ? 5 : 12} small={compact}>
          {(props) => (
            <Tbody {...props}>
              {collection.map(
                // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
                (item: any, index: number) => (
                  <HierarchyRow
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                    key={item.id}
                    first={index === 0}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'workflow_instanceid' does not exist on t... Remove this comment to see the full error message
                    id={item.workflow_instanceid}
                    compact={compact}
                    item={item}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'parent_workflow_instanceId' does not exi... Remove this comment to see the full error message
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
  mapProps(({ order, ...rest }: Props): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'HierarchyInfo' does not exist on type 'O... Remove this comment to see the full error message
    hierarchy: order.HierarchyInfo
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'HierarchyInfo' does not exist on type 'O... Remove this comment to see the full error message
        map(order.HierarchyInfo, (hierarchy: any, id: number) => ({
          ...hierarchy,
          id,
        }))
      : [],
    ...rest,
  })),
  pure(['hierarchy', 'isTablet']),
  injectIntl
)(HierarchyTable);
