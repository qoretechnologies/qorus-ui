import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import { Table, Td, Tr, Th, Tbody, Thead } from 'components/new_table';
import PaneItem from '../../../components/pane_item';
import NoData from '../../../components/nodata';

const DiagramKeysTable: Function = ({
  data,
}: {
  data?: Object,
}): React.Element<any> => (
  <PaneItem title="Keys">
    {data ? (
      <Table bordered condensed>
        <Thead>
          <Tr>
            <Th> Key </Th>
            <Th> Value </Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(data).map((d, key) => {
            const val: string =
              typeof data[d] === 'object' ? data[d].join(', ') : data[d];

            return (
              <Tr key={key}>
                <Td>{d}</Td>
                <Td>{val}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    ) : (
      <NoData />
    )}
  </PaneItem>
);

export default pure(['data'])(DiagramKeysTable);
