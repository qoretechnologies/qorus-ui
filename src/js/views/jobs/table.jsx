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
import { Icon } from '@blueprintjs/core';
import { NameColumnHeader } from '../../components/NameColumn';
import DataOrEmptyTable from '../../components/DataOrEmptyTable';
import { IdColumnHeader } from '../../components/IdColumn';
import { SelectColumnHeader } from '../../components/SelectColumn';
import { ActionColumnHeader } from '../../components/ActionColumn';

type Props = {
  sortData: Object,
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
};

const JobsTable: Function = ({
  sortData,
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
  dateQuery,
  changeDateQuery,
}: Props): React.Element<any> => (
  <Table
    striped
    hover
    condensed
    fixed
    className="resource-table"
    key={collection.length}
  >
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan={7}>
          <Pull>
            <Selector
              selected={selected}
              selectedCount={selectedIds.length}
              disabled={size(collection) === 0}
            />
            <Actions selectedIds={selectedIds} show={selected !== 'none'} />
          </Pull>
          <Pull right>
            <LoadMore
              handleLoadAll={handleLoadAll}
              handleLoadMore={handleLoadMore}
              limit={limit}
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
        <Th name="last_executed" icon="calendar">
          Last run
        </Th>
        <Th name="next" icon="calendar">
          Next run
        </Th>
        <Th name="expiry_date" icon="calendar">
          Expiry Date
        </Th>
        <Th className="separated-cell" icon="grid">
          Instances
        </Th>
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={8}>
      {props => (
        <Tbody {...props}>
          {collection.map(
            (job: Object, index: number): React.Element<Row> => (
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
                {...job}
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
      updateDone: actions.jobs.updateDone,
      select: actions.jobs.select,
    }
  ),
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
