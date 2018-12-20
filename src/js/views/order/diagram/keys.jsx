import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import size from 'lodash/size';

import { Table, Td, Tr, Th, Tbody, Thead } from 'components/new_table';
import PaneItem from '../../../components/pane_item';
import NoDataIf from '../../../components/NoDataIf';
import NameColumn, { NameColumnHeader } from '../../../components/NameColumn';

const DiagramKeysTable: Function = ({
  data,
}: {
  data?: Object,
}): React.Element<any> => (
  <PaneItem title="Keys">
    <NoDataIf condition={size(data) === 0}>
      {() => (
        <Table striped condensed>
          <Thead>
            <Tr>
              <NameColumnHeader title="Key" />
              <Th icon="info-sign"> Value </Th>
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

export default pure(['data'])(DiagramKeysTable);
