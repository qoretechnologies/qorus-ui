/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../../components/new_table';
import Row from './row';
import actions from '../../../../store/api/actions';
import Pull from '../../../../components/Pull';
import CsvControl from '../../../../components/CsvControl';
import DataOrEmptyTable from '../../../../components/DataOrEmptyTable';
import { ORDER_STATES, ORDER_STATES_ARRAY } from '../../../../constants/orders';
import InstancesBar from '../../../../components/instances_bar/index';
import LoadMore from '../../../../components/LoadMore';

import Actions from './toolbar/actions';
import Selector from './toolbar/selector';
import Filters from './toolbar/filters';
import DatePicker from '../../../../components/datepicker';
import queryControl from '../../../../hocomponents/queryControl';
import ButtonGroup from '../../../../components/controls/controls';
import { SelectColumnHeader } from '../../../../components/SelectColumn';
import { NameColumnHeader } from '../../../../components/NameColumn';
import { IdColumnHeader } from '../../../../components/IdColumn';
import { ActionColumnHeader } from '../../../../components/ActionColumn';
import { DateColumnHeader } from '../../../../components/DateColumn';
import { getInstancesCountByFilters } from '../../../../helpers/interfaces';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  sortData: Object,
  sort: Function,
  handleHeaderClick: Function,
  onSortChange: Function,
  collection: Array<Object>,
  date: string,
  select: Function,
  updateDone: Function,
  canLoadMore: boolean,
  onLoadMore: Function,
  loadMoreCurrent: number,
  isTablet: boolean,
  searchPage?: boolean,
  onCSVClick: Function,
  workflow: Object,
  selected: string,
  selectedIds: Array<number>,
  dateQuery: string,
  changeDateQuery: Function,
  location: Object,
  limit: number,
  children?: any,
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
  filterQuery,
  intl,
}: Props): React.Element<any> => (
  <Table striped condensed fixed hover>
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
            <CsvControl
              onClick={onCSVClick}
              disabled={size(collection) === 0}
            />
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
                    ? workflow.TOTAL
                    : '?'
              }
            />
            {!searchPage && (
              <ButtonGroup>
                <DatePicker
                  date={dateQuery || '24h'}
                  onApplyDate={changeDateQuery}
                />
              </ButtonGroup>
            )}
            {!searchPage && <Filters location={location} />}
            {!searchPage && (
              <InstancesBar
                states={ORDER_STATES}
                instances={workflow}
                totalInstances={workflow.TOTAL}
                wrapperWidth={300}
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
          <NameColumnHeader
            title={intl.formatMessage({ id: 'table.workflow' })}
            iconName="exchange"
          />
        )}
        {!isTablet && <ActionColumnHeader />}
        <Th name="operator_lock" iconName="lock">
          <FormattedMessage id='table.lock' />
        </Th>
        <Th iconName="info-sign" name="workflowstatus">
          <FormattedMessage id='table.status' />
        </Th>
        <Th name="business_error" iconName="error">
          <FormattedMessage id='table.err' />
        </Th>
        <Th name="error_count" iconName="error">
          <FormattedMessage id='table.errors' />
        </Th>
        <Th name="warning_count" iconName="warning-sign">
          <FormattedMessage id='table.warns' />
        </Th>
        <Th name="note_count" iconName="annotation">
          <FormattedMessage id='table.notes' />
        </Th>
        <DateColumnHeader name="started" onClick={handleHeaderClick}>
          <FormattedMessage id='table.started' />
        </DateColumnHeader>
        <DateColumnHeader name="completed" onClick={handleHeaderClick}>
          <FormattedMessage id='table.completed' />
        </DateColumnHeader>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable
      condition={collection.length === 0}
      cols={isTablet ? 10 : searchPage ? 12 : 11}
    >
      {props => (
        <Tbody {...props}>
          {collection.map(
            (order: Object, index: number): React.Element<Row> => (
              <Row
                first={index === 0}
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
  connect(
    null,
    {
      sort: actions.orders.changeServerSort,
    }
  ),
  withHandlers({
    handleHeaderClick: ({ sort }: Props): Function => (name: string): void => {
      sort(name);
    },
  }),
  queryControl('date'),
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
