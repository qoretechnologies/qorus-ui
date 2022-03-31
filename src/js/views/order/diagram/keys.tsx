import size from 'lodash/size';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import NoDataIf from '../../../components/NoDataIf';
import PaneItem from '../../../components/pane_item';

const DiagramKeysTable: Function = ({
  data,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ data?: O... Remove this comment to see the full error message
  intl,
}: {
  data?: Object;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}): React.Element<any> => (
  <PaneItem title={intl.formatMessage({ id: 'order.keys' })}>
    <NoDataIf condition={size(data) === 0}>
      {() => (
        <Table striped condensed>
          <Thead>
            <Tr>
              <NameColumnHeader title={intl.formatMessage({ id: 'table.key' })} />
              <Th icon="info-sign">
                {' '}
                <FormattedMessage id="table.value" />{' '}
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(data).map((d, key) => {
              const val: string = typeof data[d] === 'object' ? data[d].join(', ') : data[d];

              return (
                <Tr key={key}>
                  <NameColumn name={d} />
                  <Td>{val}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </NoDataIf>
  </PaneItem>
);

export default compose(pure(['data']), injectIntl)(DiagramKeysTable);
