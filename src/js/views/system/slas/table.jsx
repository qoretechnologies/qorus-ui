// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';

import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../components/new_table';
import checkData from '../../../hocomponents/check-no-data';
import withModal from '../../../hocomponents/modal';
import SLARow from './row';
import { hasPermission } from '../../../helpers/user';
import { IdColumnHeader } from '../../../components/IdColumn';
import { NameColumnHeader } from '../../../components/NameColumn';
import { DescriptionColumnHeader } from '../../../components/DescriptionColumn';
import { ActionColumnHeader } from '../../../components/ActionColumn';

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
  <Table striped condensed fixed className="resource-table">
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <IdColumnHeader name="slaid" />
        <NameColumnHeader />
        <DescriptionColumnHeader name="description" />
        <Th className="text" name="type" icon="time">
          Units
        </Th>
        {hasPermission(perms, ['DELETE-SLA', 'SLA-CONTROL'], 'or') && (
          <ActionColumnHeader />
        )}
      </FixedRow>
    </Thead>
    <Tbody>
      {collection.map(
        (sla: Object, idx: number): React.Element<any> => (
          <SLARow
            first={idx === 0}
            perms={perms}
            key={sla.slaid}
            openModal={openModal}
            closeModal={closeModal}
            {...sla}
          />
        )
      )}
    </Tbody>
  </Table>
);

export default compose(
  checkData(
    ({ collection }: Props): boolean => collection && collection.length > 0
  ),
  withModal(),
  pure(['sortData', 'collection'])
)(SLATable);
