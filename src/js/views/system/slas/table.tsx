// @flow
import size from 'lodash/size';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { ActionColumnHeader } from '../../../components/ActionColumn';
import DataOrEmptyTable from '../../../components/DataOrEmptyTable';
import { DescriptionColumnHeader } from '../../../components/DescriptionColumn';
import { IdColumnHeader } from '../../../components/IdColumn';
import { NameColumnHeader } from '../../../components/NameColumn';
import { FixedRow, Table, Tbody, Th, Thead } from '../../../components/new_table';
import withModal from '../../../hocomponents/modal';
import SLARow from './row';

type Props = {
  collection: Array<Object>;
  sortData: any;
  onSortChange: Function;
  openModal: Function;
  closeModal: Function;
  perms: Array<string>;
};

const SLATable: Function = ({
  collection,
  sortData,
  onSortChange,
  openModal,
  closeModal,
  perms,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Table striped condensed fixed>
    <Thead>
      <FixedRow sortData={sortData} onSortChange={onSortChange}>
        <IdColumnHeader name="slaid" />
        <NameColumnHeader />
        <DescriptionColumnHeader name="description" />
        <Th className="text" name="type" icon="time">
          <FormattedMessage id="table.units" />
        </Th>
        <ActionColumnHeader />
      </FixedRow>
    </Thead>
    <DataOrEmptyTable condition={size(collection) === 0} cols={5}>
      {(props) => (
        <Tbody {...props}>
          {collection.map(
            // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
            (sla: any, idx: number) => (
              <SLARow
                first={idx === 0}
                perms={perms}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'slaid' does not exist on type 'Object'.
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

export default compose(withModal(), pure(['sortData', 'collection']), injectIntl)(SLATable);
