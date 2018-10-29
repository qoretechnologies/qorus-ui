import React from 'react';
import { Tbody, Tr, Td } from '../new_table';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { NonIdealState } from '@blueprintjs/core';

const DataOrEmptyTable: Function = ({
  cols,
  condition,
  children,
  ...rest
}: {
  cols: number,
  condition: boolean,
  children: Function,
}): React.Element<Tbody> =>
  condition ? (
    <Tbody {...rest} className="tbody-empty-table">
      <Tr first>
        {[...Array(cols)].map(col => (
          <Td key={col} />
        ))}
      </Tr>
      <Tr>
        <Td colspan={cols}>
          <NonIdealState
            title="No data"
            description="There are no data to display for the criteria you provided"
            visual="search"
          />
        </Td>
      </Tr>
      <Tr>
        {[...Array(cols)].map(col => (
          <Td key={col} />
        ))}
      </Tr>
    </Tbody>
  ) : (
    children(rest)
  );

export default onlyUpdateForKeys(['cols', 'children', 'condition'])(
  DataOrEmptyTable
);
