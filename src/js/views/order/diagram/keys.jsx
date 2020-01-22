import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import { Table, Td, Tr, Th, Tbody, Thead } from '../../../components/new_table';
import PaneItem from '../../../components/pane_item';
import NoDataIf from '../../../components/NoDataIf';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';
import { injectIntl, FormattedMessage } from 'react-intl';

const DiagramKeysTable: Function = ({
  data,
  intl,
}: {
  data?: Object,
}): React.Element<any> => (
  <PaneItem title={intl.formatMessage({ id: 'order.keys' })}>
    <NoDataIf condition={size(data) === 0}>
      {() => (
        <Table striped condensed>
          <Thead>
            <Tr>
              <NameColumnHeader title={intl.formatMessage({ id: 'table.key' })} />
              <Th icon="info-sign"> <FormattedMessage id='table.value' /> </Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.keys(data).map((d, key) => {
              const val: string =
                typeof data[d] === 'object' ? data[d].join(', ') : data[d];

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

export default compose(
  pure(['data']),
  injectIntl
)(DiagramKeysTable);
