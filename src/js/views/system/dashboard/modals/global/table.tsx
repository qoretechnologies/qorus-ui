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
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
          ? workflow.completed + workflow.automatically + workflow.manually
          : totalOrderStats;

        return (
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          <Tr key={workflow.id} first={index === 0}>
            <NameColumn
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              name={workflow.name}
              type="workflow"
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              link={`/workflows?paneId=${workflow.id}&paneTab=order stats`}
            />
            <Td>
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message */ }
              {workflow.completed} (
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message */ }
              {orderStatsPct(workflow.completed, totalStats)}
              %)
              <ProgressBar
                intent={Intent.SUCCESS}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
                value={orderStatsPct(workflow.completed, totalStats) / 100}
                className="bp3-no-animation"
              />
            </Td>
            <Td>
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message */ }
              {workflow.automatically} (
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message */ }
              {orderStatsPct(workflow.automatically, totalStats)}
              %)
              <ProgressBar
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message
                value={orderStatsPct(workflow.automatically, totalStats) / 100}
                className="bp3-no-animation progress-bar-auto"
              />
            </Td>
            <Td>
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message */ }
              {workflow.manually} (
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message */ }
              {orderStatsPct(workflow.manually, totalStats)}
              %)
              <ProgressBar
                intent={Intent.DANGER}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message
                value={orderStatsPct(workflow.manually, totalStats) / 100}
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
