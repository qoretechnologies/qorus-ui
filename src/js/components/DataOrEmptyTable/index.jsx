import React from 'react';
import { Tbody, Tr, Td } from '../new_table';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import NoData from '../nodata';

const DataOrEmptyTable: Function = ({
  cols,
  condition,
  children,
  small,
  ...rest
}: {
  cols: number,
  condition: boolean,
  children: Function,
  small: boolean,
}): React.Element<Tbody> =>
  condition ? (
    <Tbody {...rest} className="tbody-empty-table">
      <Tr first className="placeholder-row">
        {[...Array(cols)].map(col => (
          <Td key={col} />
        ))}
      </Tr>
      <Tr>
        <Td colspan={cols}>
          <div className="no-data-table-wrapper">
            <NoData big={!small} />
          </div>
        </Td>
      </Tr>
    </Tbody>
  ) : (
    children(rest)
  );

export default onlyUpdateForKeys(['cols', 'children', 'condition'])(
  DataOrEmptyTable
);
