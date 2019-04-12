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
  FixedRow,
} from '../../../../../components/new_table';
import NameColumn, {
  NameColumnHeader,
} from '../../../../../components/NameColumn';
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
  <Table fixed condensed striped>
    <Thead>
      <FixedRow {...{ sortData, onSortChange }}>
        <NameColumnHeader />
        <Th name={local ? 'completedLocalPct' : 'completedTotalPct'}>
          C (No errors)
        </Th>
        <Th name={local ? 'automaticallyLocalPct' : 'automaticallyTotalPct'}>
          A (Recovered Automatically)
        </Th>
        <Th name={local ? 'manuallyLocalPct' : 'manuallyTotalPct'}>
          M (Recovered Manually)
        </Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {workflows.map((workflow: Object, index: number) => {
        const totalStats: number = local
          ? workflow.completed + workflow.automatically + workflow.manually
          : totalOrderStats;

        return (
          <Tr key={workflow.id} first={index === 0}>
            <NameColumn
              name={workflow.name}
              type="workflow"
              link={`/workflows?paneId=${workflow.id}&paneTab=order stats`}
            />
            <Td>
              {workflow.completed} (
              {orderStatsPct(workflow.completed, totalStats)}
              %)
              <ProgressBar
                intent={Intent.SUCCESS}
                value={orderStatsPct(workflow.completed, totalStats) / 100}
                className="pt-no-animation"
              />
            </Td>
            <Td>
              {workflow.automatically} (
              {orderStatsPct(workflow.automatically, totalStats)}
              %)
              <ProgressBar
                value={orderStatsPct(workflow.automatically, totalStats) / 100}
                className="pt-no-animation progress-bar-auto"
              />
            </Td>
            <Td>
              {workflow.manually} (
              {orderStatsPct(workflow.manually, totalStats)}
              %)
              <ProgressBar
                intent={Intent.DANGER}
                value={orderStatsPct(workflow.manually, totalStats) / 100}
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
