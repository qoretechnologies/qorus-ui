import React from 'react';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Tbody, Td, Tr } from '../new_table';
import NoData from '../nodata';

const DataOrEmptyTable: Function = ({
  cols,
  condition,
  children,
  small,
  ...rest
}: {
  cols: number;
  condition: boolean;
  children: Function;
  small: boolean;
  // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}) =>
  condition ? (
    <Tbody {...rest} className="tbody-empty-table">
      <Tr first className="placeholder-row">
        {[...Array(cols)].map((col) => (
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

export default onlyUpdateForKeys(['cols', 'children', 'condition'])(DataOrEmptyTable);
