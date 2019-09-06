/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import size from 'lodash/size';

import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Row from './row';
import actions from '../../store/api/actions';
import Pull from '../../components/Pull';
import Selector from './toolbar/selector';
import Actions from './toolbar/actions';
import LoadMore from '../../components/LoadMore';
import queryControl from '../../hocomponents/queryControl';
import DatePicker from '../../components/datepicker';
import { NameColumnHeader } from '../../components/NameColumn';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { IdColumnHeader } from '../../components/IdColumn';
import { SelectColumnHeader } from '../../components/SelectColumn';
import { ActionColumnHeader } from '../../components/ActionColumn';
import SortingDropdown from '../../components/SortingDropdown';
import withHandlers from 'recompose/withHandlers';
import moment from 'moment';
import { DATE_FORMATS } from '../../constants/dates';
import withDispatch from '../../hocomponents/withDispatch';

type Props = {
  sortData: Object,
  sortKeys: Object,
  onSortChange: Function,
  collection: Array<Object>,
  paneId?: number,
  openPane: Function,
  closePane: Function,
  date: string,
  select: Function,
  updateDone: Function,
  canLoadMore: boolean,
  isTablet: boolean,
  handleLoadMore: Function,
  handleLoadAll: Function,
  limit: number,
  selected: string,
  selectedIds: Array<number>,
  dateQuery: string,
  changeDateQuery: Function,
  handleExpiryChange: Function,
  dispatchAction: Function,
  loadMoreCurrent: number,
  loadMoreTotal: number,
};

const JobsTable: Function = ({
  sortData,
  sortKeys,
  onSortChange,
  collection,
  paneId,
  openPane,
  closePane,
  date,
  select,
  updateDone,
  canLoadMore,
  isTablet,
  selected,
  selectedIds,
  limit,
  handleLoadMore,
  handleLoadAll,
  loadMoreCurrent,
  loadMoreTotal,
  dateQuery,
  changeDateQuery,
  handleExpiryChange,
}: Props): React.Element<any> => (
  <Table striped hover condensed fixed>
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan={isTablet ? 6 : 7}>
          <Pull>
            <Selector
              selected={selected}
              selectedCount={selectedIds.length}
              disabled={size(collection) === 0}
            />
            <Actions selectedIds={selectedIds} show={selected !== 'none'} />
            <SortingDropdown
              onSortChange={onSortChange}
              sortData={sortData}
              sortKeys={sortKeys}
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
          </Pull>
        </Th>
        <Th className="separated-cell">
          <DatePicker date={dateQuery || '24h'} onApplyDate={changeDateQuery} />
        </Th>
      </FixedRow>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <SelectColumnHeader />
        <IdColumnHeader />
        <NameColumnHeader />
        <ActionColumnHeader />
        <Th name="last_executed" iconName="calendar">
          Last run
        </Th>
        <Th name="next" iconName="calendar">
          Next run
        </Th>
        {!isTablet && (
          <Th name="expiry_date" iconName="outdated">
            Expiry Date
          </Th>
        )}
        <Th className="separated-cell" iconName="grid">
          Instances
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable
      condition={size(collection) === 0}
      cols={isTablet ? 7 : 8}
    >
      {props => (
        <Tbody {...props}>
          {collection.map((job: Object, index: number): React.Element<Row> => (
            <Row
              first={index === 0}
              key={`job_${job.id}`}
              isActive={job.id === parseInt(paneId, 10)}
              openPane={openPane}
              closePane={closePane}
              date={date}
              select={select}
              updateDone={updateDone}
              PROGRESS={job['IN-PROGRESS']}
              isTablet={isTablet}
              onExpiryChange={handleExpiryChange}
              {...job}
            />
          ))}
        </Tbody>
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.jobs.updateDone,
      select: actions.jobs.select,
    }
  ),
  withDispatch(),
  withHandlers({
    handleExpiryChange: ({ dispatchAction }: Props): Function => (
      date: Object,
      id: number,
      onClose: Function
    ): void => {
      const formatedDate: string = moment(date, DATE_FORMATS.PROP).format(
        DATE_FORMATS.PROP
      );

      dispatchAction(actions.jobs.expire, id, formatedDate, onClose);
    },
  }),
  queryControl('date'),
  pure([
    'sortData',
    'collection',
    'paneId',
    'date',
    'isTablet',
    'dateQuery',
    'selected',
    'selectedIds',
    'canLoadMore',
  ])
)(JobsTable);
