// @flow
import React from 'react';
import { Link } from 'react-router';

import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
} from '../../../../../components/new_table';
import {
  ProgressBar,
  Intent,
} from '../../../../../../../node_modules/@blueprintjs/core';
import { orderStatsPct } from '../../../../../helpers/orders';

type Props = {
  workflows: Array<Object>,
  totalOrderStats: number,
  sortData: Object,
  onSortChange: Function,
  local: boolean,
};

const GlobalModalTable: Function = ({
  workflows,
  totalOrderStats,
  sortData,
  onSortChange,
  local,
}: Props) => (
  <Table condensed striped height={400}>
    <Thead>
      <Tr {...{ sortData, onSortChange }}>
        <Th className="name" name="name">
          Name
        </Th>
        <Th name="completed">In SLA</Th>
        <Th name="automatically">Out of SLA</Th>
      </Tr>
    </Thead>
    <Tbody>
      {workflows.map((workflow: Object) => {
        const totalStats: number = local
          ? workflow.inSla + workflow.outOfSla
          : totalOrderStats;

        return (
          <Tr key={workflow.id}>
            <Td className="name">
              <Link to={`/workflows?paneId${workflow.id}`}>
                {workflow.name}
              </Link>
            </Td>
            <Td>
              {workflow.inSla} ({orderStatsPct(workflow.inSla, totalStats)}
              %)
              <ProgressBar
                intent={Intent.SUCCESS}
                value={orderStatsPct(workflow.inSla, totalStats) / 100}
                className="pt-no-animation"
              />
            </Td>
            <Td>
              {workflow.outOfSla} (
              {orderStatsPct(workflow.outOfSla, totalStats)}
              %)
              <ProgressBar
                intent={Intent.DANGER}
                value={orderStatsPct(workflow.outOfSla, totalStats) / 100}
                className="pt-no-animation"
              />
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
);

export default GlobalModalTable;
