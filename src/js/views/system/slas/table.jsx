// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import size from 'lodash/size';

import {
  Table,
  Thead,
  Tbody,
  FixedRow,
  Th,
} from '../../../components/new_table';
import withModal from '../../../hocomponents/modal';
import SLARow from './row';
import { IdColumnHeader } from '../../../components/IdColumn';
import { NameColumnHeader } from '../../../components/NameColumn';
import { DescriptionColumnHeader } from '../../../components/DescriptionColumn';
import { ActionColumnHeader } from '../../../components/ActionColumn';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { injectIntl, FormattedMessage } from 'react-intl';

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
  intl,
}: Props): React.Element<any> => (
  <Table striped condensed fixed>
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <IdColumnHeader name="slaid" />
        <NameColumnHeader />
        <DescriptionColumnHeader
          name="description"
        />
        <Th className="text" name="type" icon="time">
          <FormattedMessage id='table.units' />
        </Th>
        <ActionColumnHeader />
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={5}>
      {props => (
        <Tbody {...props}>
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
      )}
    </DataOrEmptyTable>
  </Table>
);

export default compose(
  withModal(),
  pure(['sortData', 'collection']),
  injectIntl
)(SLATable);
