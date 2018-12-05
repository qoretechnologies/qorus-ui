/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';

import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../../../components/new_table';
import Row from './row';
import actions from '../../../../../store/api/actions';
import Pull from '../../../../../components/Pull';
import CsvControl from '../../../../../components/CsvControl';
import { Icon, ButtonGroup } from '@blueprintjs/core';
import DataOrEmptyTable from '../../../../../components/DataOrEmptyTable';
import {
  ORDER_STATES,
  ORDER_STATES_ARRAY,
} from '../../../../../constants/orders';
import InstancesBar from '../../../../../components/instances_bar/index';
import LoadMore from '../../../../../components/LoadMore';

import Actions from './toolbar/actions';
import Selector from './toolbar/selector';
import Filters from './toolbar/filters';
import DatePicker from '../../../../../components/datepicker';
import queryControl from '../../../../../hocomponents/queryControl';

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
}: Props): React.Element<any> => (
  <Table
    striped
    condensed
    fixed
    className="resource-table"
    key={collection.length}
  >
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
            <Selector selected={selected} selectedCount={selectedIds.length} />
            <Actions show={selected !== 'none'} selectedIds={selectedIds} />
            {!searchPage && (
              <ButtonGroup>
                <DatePicker
                  date={dateQuery || '24h'}
                  onApplyDate={changeDateQuery}
                />
              </ButtonGroup>
            )}
            {!searchPage && <Filters location={location} />}
            <CsvControl onClick={onCSVClick} />
          </Pull>
          <Pull right>
            <LoadMore
              onLoadMore={onLoadMore}
              limit={limit}
              canLoadMore={canLoadMore}
            />
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
        <Th className="tiny">
          <Icon iconName="small-tick" />
        </Th>
        {!isTablet && searchPage && <Th className="name"> Worfklow </Th>}
        <Th className="medium"> ID </Th>
        {!isTablet && <Th className="medium"> Actions </Th>}
        <Th className="medium"> Status </Th>
        <Th className="narrow" name="business_error">
          Err.
        </Th>
        <Th className="big" name="started" onClick={handleHeaderClick}>
          Started
        </Th>
        <Th className="big" name="completed" onClick={handleHeaderClick}>
          Completed
        </Th>
        <Th className="narrow" name="error_count">
          Errors
        </Th>
        <Th className="narrow" name="warning_count">
          Warns.
        </Th>
        <Th className="medium" name="operator_lock">
          Lock
        </Th>
        <Th className="narrow" name="note_count">
          Notes
        </Th>
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
                key={`order_${order.workflow_instanceid}`}
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
  ])
)(WorkflowTable);
