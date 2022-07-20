// @flow
import { Intent, ProgressBar } from '@blueprintjs/core';
import React from 'react';
import NameColumn, { NameColumnHeader } from '../../../../../components/NameColumn';
import { FixedRow, Table, Tbody, Td, Th, Thead, Tr } from '../../../../../components/new_table';
import { orderStatsPct } from '../../../../../helpers/orders';

type Props = {
  workflows: Array<Object>;
  totalOrderStats: number;
  sortData: any;
  onSortChange: Function;
  local: boolean;
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
        <Th name={local ? 'completedLocalPct' : 'completedTotalPct'}>C (No errors)</Th>
        <Th name={local ? 'automaticallyLocalPct' : 'automaticallyTotalPct'}>
          A (Recovered Automatically)
        </Th>
        <Th name={local ? 'manuallyLocalPct' : 'manuallyTotalPct'}>M (Recovered Manually)</Th>
      </FixedRow>
    </Thead>
    <Tbody>
      {workflows.map((workflow: any, index: number) => {
        const totalStats: number = local
          ? // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
            workflow.completed + workflow.automatically + workflow.manually
          : totalOrderStats;

        return (
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          <Tr key={workflow.id} first={index === 0}>
            <NameColumn
              // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              name={workflow.name}
              type="workflow"
              // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              link={`/workflows?paneId=${workflow.id}&paneTab=order stats`}
            />
            <Td>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message */}
              {workflow.completed} (
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message */}
              {orderStatsPct(workflow.completed, totalStats)}
              %)
              <ProgressBar
                intent={Intent.SUCCESS}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
                value={orderStatsPct(workflow.completed, totalStats) / 100}
                className="bp3-no-animation"
              />
            </Td>
            <Td>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message */}
              {workflow.automatically} (
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message */}
              {orderStatsPct(workflow.automatically, totalStats)}
              %)
              <ProgressBar
                // @ts-ignore ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message
                value={orderStatsPct(workflow.automatically, totalStats) / 100}
                className="bp3-no-animation progress-bar-auto"
              />
            </Td>
            <Td>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message */}
              {workflow.manually} (
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message */}
              {orderStatsPct(workflow.manually, totalStats)}
              %)
              <ProgressBar
                intent={Intent.DANGER}
                // @ts-ignore ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message
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
