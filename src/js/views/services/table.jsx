// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';

import withSort from '../../hocomponents/sort';
import actions from '../../store/api/actions';
import { sortDefaults } from '../../constants/sort';
import { Table, Thead, Tbody, Tr, Th } from '../../components/new_table';
import Icon from '../../components/icon';
import Row from './row';

type Props = {
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  paneId: string | number,
  openPane: Function,
  select: Function,
  updateDone: Function,
};

const ServicesTable: Function = ({
  sortData,
  onSortChange,
  collection,
  paneId,
  openPane,
  select,
  updateDone,
}: Props): React.Element<any> => (
  <Table
    fixed
    hover
    condensed
    striped
    className="resource-table"
  >
    <Thead>
      <Tr
        sortData={sortData}
        onSortChange={onSortChange}
      >
        <Th className="tiny">-</Th>
        <Th className="narrow">-</Th>
        <Th className="narrow" name="type">Type</Th>
        <Th className="medium">Actions</Th>
        <Th className="narrow" name="threads">Threads</Th>
        <Th className="narrow" name="has_alerts">
          <Icon icon="warning" />
        </Th>
        <Th className="narrow" name="id">ID</Th>
        <Th className="name" name="name">Name</Th>
        <Th className="medium" name="version">Version</Th>
        <Th name="desc">Description</Th>
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((service: Object): React.Element<Row> => (
        <Row
          key={`service_${service.id}`}
          isActive={service.id === parseInt(paneId, 10)}
          openPane={openPane}
          select={select}
          updateDone={updateDone}
          {...service}
        />
      ))}
    </Tbody>
  </Table>
);

export default compose(
  connect(
    null,
    {
      updateDone: actions.services.updateDone,
      select: actions.services.select,
    }
  ),
  withSort('services', 'collection', sortDefaults.services),
  pure([
    'collection',
    'sortData',
    'paneId',
  ])
)(ServicesTable);
