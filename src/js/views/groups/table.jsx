// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import actions from '../../store/api/actions';
import { Table, Thead, Tbody, Tr, Th } from '../../components/new_table';
import Row from './row';

type Props = {
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  select: Function,
  updateDone: Function,
};

const GroupsTable: Function = ({
  sortData,
  onSortChange,
  collection,
  select,
  updateDone,
}: Props): React.Element<any> => (
  <Table
    fixed
    hover
    condensed
    striped
    className="resource-table"
    marginBottom={30}
  >
    <Thead>
      <Tr
        sortData={sortData}
        onSortChange={onSortChange}
      >
        <Th className="tiny">-</Th>
        <Th className="medium" name="enabled">Enabled</Th>
        <Th className="narrow" name="id">ID</Th>
        <Th className="name" name="name">Name</Th>
        <Th name="description">Description</Th>
        <Th className="medium" name="workflows_count"> Workflows </Th>
        <Th className="medium" name="services_count"> Services </Th>
        <Th className="medium" name="jobs_count"> Jobs </Th>
        <Th className="medium" name="vmaps_count"> Vmaps </Th>
        <Th className="medium" name="roles_count"> Roles </Th>
        <Th className="medium" name="mappers_count"> Mappers </Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((group: Object): React.Element<Row> => (
        <Row
          key={`group_${group.id}`}
          select={select}
          updateDone={updateDone}
          {...group}
        />
      ))}
    </Tbody>
  </Table>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.groups.updateDone,
      select: actions.groups.select,
    }
  ),
  pure([
    'collection',
    'sortData',
  ])
)(GroupsTable);
