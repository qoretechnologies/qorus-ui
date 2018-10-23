/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import checkData from '../../hocomponents/check-no-data';

import { Table, Thead, Tbody, FixedRow, Th } from '../../components/new_table';
import Icon from '../../components/icon';
import Row from './row';
import actions from '../../store/api/actions';
import Pull from '../../components/Pull';
import Selector from './toolbar/selector';
import Actions from './toolbar/actions';
import LoadMore from '../../components/LoadMore';
import queryControl from '../../hocomponents/queryControl';
import DatePicker from '../../components/datepicker';

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
    marginBottom={canLoadMore ? 20 : 0}
    key={collection.length}
  >
    <Thead>
      <FixedRow className="toolbar-row">
        <Th colspan={10}>
          <Pull>
            <Selector selected={selected} selectedCount={selectedIds.length} />
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
        <Th className="tiny checker">-</Th>
        <Th className="narrow">-</Th>
        {!isTablet && <Th className="big">Actions</Th>}
        <Th className="narrow" name="has_alerts">
          <Icon iconName="warning" />
        </Th>
        <Th className="narrow" name="id">
          ID
        </Th>
        <Th className="name" name="name">
          Name
        </Th>
        <Th className="normal text" name="version">
          Version
        </Th>
        <Th className="big" name="last_executed">
          Last
        </Th>
        <Th className="big" name="next">
          Next
        </Th>
        <Th className="big" name="expiry_date">
          Expiry Date
        </Th>
        <Th className="big separated-cell">Instances</Th>
      </FixedRow>
    </Thead>
    <Tbody>
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
  checkData(
    ({ collection }: Props): boolean => collection && collection.length > 0
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
