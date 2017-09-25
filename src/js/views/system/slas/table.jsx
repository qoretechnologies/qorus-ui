// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';

import { Table, Thead, Tbody, Tr, Th } from '../../../components/new_table';
import checkData from '../../../hocomponents/check-no-data';
import withModal from '../../../hocomponents/modal';
import SLARow from './row';
import { hasPermission } from '../../../helpers/user';

type Props = {
  collection: Array<Object>,
  sortData: Object,
  onSortChange: Function,
  openModal: Function,
  closeModal: Function,
  perms: Array<string>,
};

const SLATable: Function = ({
  collection,
  sortData,
  onSortChange,
  openModal,
  closeModal,
  perms,
}: Props): React.Element<any> => (
  <Table
    striped
    condensed
    fixed
    className="resource-table"
    key={collection.length}
  >
    <Thead>
      <Tr
        sortData={sortData}
        onSortChange={onSortChange}
      >
        <Th className="narrow" name="slaid">ID</Th>
        <Th className="text" name="name">Name</Th>
        <Th className="text" name="description">Description</Th>
        <Th className="text" name="type">Units</Th>
        {hasPermission(perms, ['DELETE-SLA', 'SLA-CONTROL'], 'or') && (
          <Th className="narrow">Actions</Th>
        )}
      </Tr>
    </Thead>
    <Tbody>
      {collection.map((sla: Object): React.Element<any> => (
        <SLARow
          perms={perms}
          key={sla.slaid}
          openModal={openModal}
          closeModal={closeModal}
          {...sla}
        />
      ))}
    </Tbody>
  </Table>
);

export default compose(
  checkData(({ collection }: Props): boolean => collection && collection.length > 0),
  withModal(),
  pure([
    'sortData',
    'collection',
  ])
)(SLATable);
