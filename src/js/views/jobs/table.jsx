/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import { Table, Thead, Tbody, Tr, Th } from '../../components/new_table';
import withSort from '../../hocomponents/sort';
import Icon from '../../components/icon';
import { sortDefaults } from '../../constants/sort';
import Row from './row';
import actions from '../../store/api/actions';

type Props = {
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  paneId?: number,
  openPane: Function,
  date: string,
  select: Function,
  updateDone: Function,
};

const JobsTable: Function = ({
  sortData,
  onSortChange,
  collection,
  paneId,
  openPane,
  date,
  select,
  updateDone,
}: Props): React.Element<any> => (
  <Table
    striped
    hover
    condensed
    fixed
    className="resource-table"
  >
    <Thead>
      <Tr
        sortData={sortData}
        onSortChange={onSortChange}
      >
        <Th className="tiny checker">-</Th>
        <Th className="narrow">-</Th>
        <Th className="big">Actions</Th>
        <Th className="narrow" name="has_alerts">
          <Icon icon="warning" />
        </Th>
        <Th className="narrow" name="id">ID</Th>
        <Th className="name" name="name">Name</Th>
        <Th className="normal" name="version">Version</Th>
        <Th className="big" name="last_executed">Last</Th>
        <Th className="big" name="next">Next</Th>
        <Th className="big" name="expiry_date">Expiry Date</Th>
        <Th className="normal" name="COMPLETE">Complete</Th>
        <Th className="normal" name="ERROR">Error</Th>
        <Th className="normal" name="IN-PROGRESS">In progress</Th>
        <Th className="normal" name="CRASHED">Crashed</Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((job: Object): React.Element<Row> => (
        <Row
          key={`job_${job.id}`}
          isActive={job.id === parseInt(paneId, 10)}
          openPane={openPane}
          date={date}
          select={select}
          updateDone={updateDone}
          PROGRESS={job['IN-PROGRESS']}
          {...job}
        />
      ))}
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
  withSort('jobs', 'collection', sortDefaults.jobs),
  pure([
    'sortData',
    'collection',
    'paneId',
    'date',
  ])
)(JobsTable);
