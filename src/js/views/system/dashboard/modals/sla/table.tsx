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
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'inSla' does not exist on type 'Object'.
          ? workflow.inSla + workflow.outOfSla
          : totalOrderStats;

        return (
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          <Tr key={workflow.id} first={index === 0}>
            <NameColumn
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
              name={workflow.name}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
              link={`/workflows?paneId=${workflow.id}&paneTab=order stats`}
              type="workflow"
            />
            <Td>
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'inSla' does not exist on type 'Object'. */ }
              {workflow.inSla} ({orderStatsPct(workflow.inSla, totalStats)}
              %)
              <ProgressBar
                intent={Intent.SUCCESS}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'inSla' does not exist on type 'Object'.
                value={orderStatsPct(workflow.inSla, totalStats) / 100}
                className="bp3-no-animation"
              />
            </Td>
            <Td>
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'outOfSla' does not exist on type 'Object... Remove this comment to see the full error message */ }
              {workflow.outOfSla} (
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'outOfSla' does not exist on type 'Object... Remove this comment to see the full error message */ }
              {orderStatsPct(workflow.outOfSla, totalStats)}
              %)
              <ProgressBar
                intent={Intent.DANGER}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'outOfSla' does not exist on type 'Object... Remove this comment to see the full error message
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
