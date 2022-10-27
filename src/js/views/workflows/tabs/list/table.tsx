import size from 'lodash/size';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import ButtonGroup from '../../../../components/controls/controls';
import CsvControl from '../../../../components/CsvControl';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import { DateColumnHeader } from '../../../../components/DateColumn';
import DatePicker from '../../../../components/datepicker';
import { IdColumnHeader } from '../../../../components/IdColumn';
import InstancesBar from '../../../../components/instances_bar/index';
import LoadMore from '../../../../components/LoadMore';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../../components/new_table';
import Pull from '../../../../components/Pull';
import { SelectColumnHeader } from '../../../../components/SelectColumn';
import { ORDER_STATES, ORDER_STATES_ARRAY } from '../../../../constants/orders';
import { getInstancesCountByFilters } from '../../../../helpers/interfaces';
import queryControl from '../../../../hocomponents/queryControl';
import actions from '../../../../store/api/actions';
import Row from './row';
import Actions from './toolbar/actions';
import Filters from './toolbar/filters';
import Selector from './toolbar/selector';

type Props = {
  sortData: any;
  sort: Function;
  handleHeaderClick: Function;
  onSortChange: Function;
  collection: Array<Object>;
  date: string;
  select: Function;
  updateDone: Function;
  canLoadMore: boolean;
  onLoadMore: Function;
  loadMoreCurrent: number;
  isTablet: boolean;
  searchPage?: boolean;
  onCSVClick: Function;
  workflow: any;
  selected: string;
  selectedIds: Array<number>;
  dateQuery: string;
  changeDateQuery: Function;
  location: any;
  limit: number;
  children?: any;
};

const WorkflowTable: Function = ({
  sortData,
  onSortChange,
  collection,
  date,
  handleHeaderClick,
  canLoadMore,
  onLoadMore,
  loadMoreCurrent,
  isTablet,
  searchPage,
  onCSVClick,
  workflow,
  selected,
  selectedIds,
  dateQuery,
  changeDateQuery,
  location,
  limit,
  children,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'filterQuery' does not exist on type 'Pro... Remove this comment to see the full error message
  filterQuery,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Table striped condensed fixed hover id="orders-view">
    <Thead>
      {children && (
        <FixedRow className="toolbar-row">
          <Th colspan="full">
            <Pull>{children}</Pull>
          </Th>
        </FixedRow>
      )}
      <FixedRow className="toolbar-row">
        <Th colspan="full">
          <Pull>
            <Selector
              selected={selected}
              selectedCount={selectedIds.length}
              disabled={size(collection) === 0}
            />
            <Actions show={selected !== 'none'} selectedIds={selectedIds} />
            <CsvControl onClick={onCSVClick} disabled={size(collection) === 0} />
          </Pull>
          <Pull right>
            <LoadMore
              onLoadMore={onLoadMore}
              limit={limit}
              canLoadMore={canLoadMore}
              currentCount={loadMoreCurrent}
              total={
                filterQuery
                  ? getInstancesCountByFilters(filterQuery.split(','), workflow)
                  : workflow
                  ? // @ts-ignore ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type 'Object'.
                    workflow.TOTAL
                  : '?'
              }
            />
            {!searchPage && (
              <ButtonGroup>
                <DatePicker
                  date={dateQuery || '24h'}
                  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                  onApplyDate={changeDateQuery}
                />
              </ButtonGroup>
            )}
            {!searchPage && <Filters location={location} />}
            {!searchPage && (
              <InstancesBar
                states={ORDER_STATES}
                instances={workflow}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type 'Object'.
                totalInstances={workflow.TOTAL}
                wrapperWidth={300}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                id={workflow.id}
                date={date}
                big
              />
            )}
          </Pull>
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <SelectColumnHeader />
        <IdColumnHeader />
        {!isTablet && searchPage && (
          <NameColumnHeader title={intl.formatMessage({ id: 'table.workflow' })} icon="exchange" />
        )}
        {!isTablet && <ActionColumnHeader />}
        <Th name="operator_lock" icon="lock">
          <FormattedMessage id="table.lock" />
        </Th>
        <Th icon="info-sign" name="workflowstatus">
          <FormattedMessage id="table.status" />
        </Th>
        <Th name="business_error" icon="error">
          <FormattedMessage id="table.err" />
        </Th>
        <Th name="error_count" icon="error">
          <FormattedMessage id="table.errors" />
        </Th>
        <Th name="warning_count" icon="warning-sign">
          <FormattedMessage id="table.warns" />
        </Th>
        <Th name="note_count" icon="annotation">
          <FormattedMessage id="table.notes" />
        </Th>
        <DateColumnHeader name="started" onClick={handleHeaderClick}>
          <FormattedMessage id="table.started" />
        </DateColumnHeader>
        <DateColumnHeader name="completed" onClick={handleHeaderClick}>
          <FormattedMessage id="table.completed" />
        </DateColumnHeader>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable
      condition={collection.length === 0}
      cols={isTablet ? 10 : searchPage ? 12 : 11}
    >
      {(props) => (
        <Tbody {...props}>
          {collection.map(
            // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
            (order: any, index: number) => (
              <Row
                first={index === 0}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                key={order.id}
                date={date}
                isTablet={isTablet}
                searchPage={searchPage}
                {...order}
              />
            )
          )}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  connect(null, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    sort: actions.orders.changeServerSort,
  }),
  withHandlers({
    handleHeaderClick:
      ({ sort }: Props): Function =>
      (name: string): void => {
        sort(name);
      },
  }),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('date'),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('filter'),
  pure([
    ...ORDER_STATES_ARRAY,
    'sortData',
    'collection',
    'date',
    'dateQuery',
    'isTablet',
    'searchPage',
    'selected',
    'selectedIds',
    'canLoadMore',
  ]),
  injectIntl
)(WorkflowTable);
