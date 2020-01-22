// @flow
import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  FixedRow,
} from '../../../../../components/new_table';
import {
  ProgressBar,
  Intent,
} from '../../../../../../../node_modules/@blueprintjs/core';
import { orderStatsPct } from '../../../../../helpers/orders';
import NameColumn, {
  NameColumnHeader,
} from '../../../../../components/NameColumn';

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
  <Table fixed condensed striped>
    <Thead>
      <FixedRow {...{ sortData, onSortChange }}>
        <NameColumnHeader />
        <Th name={local ? 'inSlaLocalPct' : 'inSlaTotalPct'}>In SLA</Th>
        <Th name={local ? 'outOfSlaLocalPct' : 'outOfSlaTotalPct'}>
          Out of SLA
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {workflows.map((workflow: Object, index: number) => {
        const totalStats: number = local
          ? workflow.inSla + workflow.outOfSla
          : totalOrderStats;

        return (
          <Tr key={workflow.id} first={index === 0}>
            <NameColumn
              name={workflow.name}
              link={`/workflows?paneId=${workflow.id}&paneTab=order stats`}
              type="workflow"
            />
            <Td>
              {workflow.inSla} ({orderStatsPct(workflow.inSla, totalStats)}
              %)
              <ProgressBar
                intent={Intent.SUCCESS}
                value={orderStatsPct(workflow.inSla, totalStats) / 100}
                className="bp3-no-animation"
              />
            </Td>
            <Td>
              {workflow.outOfSla} (
              {orderStatsPct(workflow.outOfSla, totalStats)}
              %)
              <ProgressBar
                intent={Intent.DANGER}
                value={orderStatsPct(workflow.outOfSla, totalStats) / 100}
                className="bp3-no-animation"
              />
            </Td>
          </Tr>
        );
      })}
    </Tbody>
  </Table>
);

export default GlobalModalTable;
