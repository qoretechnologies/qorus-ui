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
        {!isTablet && (
          <Th className="big" name="expiry_date">
            Expiry Date
          </Th>
        )}
        <Th
          className={isTablet ? 'narrow' : 'normal'}
          name="COMPLETE"
          title="Complete"
        >
          {isTablet ? 'CMP' : 'Complete'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'normal'}
          name="ERROR"
          title="Error"
        >
          {isTablet ? 'ERR' : 'Error'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'normal'}
          name="IN-PROGRESS"
          title="In Progress"
        >
          {isTablet ? 'PRG' : 'In Progress'}
        </Th>
        <Th
          className={isTablet ? 'narrow' : 'normal'}
          name="CRASHED"
          title="Crashed"
        >
          {isTablet ? 'CSH' : 'Crashed'}
        </Th>
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
    () => ({}),
    {
      updateDone: actions.jobs.updateDone,
      select: actions.jobs.select,
    }
  ),
  checkData(
    ({ collection }: Props): boolean => collection && collection.length > 0
  ),
  pure(['sortData', 'collection', 'paneId', 'date', 'isTablet'])
)(JobsTable);
