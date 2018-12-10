// @flow
import React from 'react';
import { ProgressBar } from '@blueprintjs/core';

import { Table, Thead, Tr, Th, Td, Tbody } from '../new_table';
import replace from 'lodash/replace';
import PaneItem from '../pane_item';
import { ORDER_STATS_LEGEND } from '../../constants/orders';
import { orderStatsPctColorDisp } from '../../helpers/orders';
import DispositionChart from '../disposition_chart';
import NoDataIf from '../NoDataIf';

type Props = {
  orderStats: Array<Object>,
};

const StatsTab: Function = ({ orderStats }: Props): any => (
  <NoDataIf condition={!orderStats} big>
    {() => (
      <div>
        {orderStats.map(
          ({ label, l, sla }: Object): any => (
            <PaneItem title={replace(label, /_/g, ' ')}>
              <DispositionChart stats={{ ...{ label, l, sla } }} />
              <Table condensed striped>
                <Thead>
                  <Tr>
                    <Th className="name text">Disposition</Th>
                    <Th>Count</Th>
                    <Th>Percentage</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {l.map((data: any) => (
                    <Tr>
                      <Td className="name text">
                        {ORDER_STATS_LEGEND[data.disposition]}
                      </Td>
                      <Td>{data.count}</Td>
                      <Td>
                        {Math.round(data.pct)}%{' '}
                        <ProgressBar
                          intent={orderStatsPctColorDisp(data.disposition)}
                          value={Math.round(data.pct) / 100}
                          className={`pt-no-animation ${
                            data.disposition === 'A' ? 'progress-bar-auto' : ''
                          }`}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PaneItem>
          )
        )}
      </div>
    )}
  </NoDataIf>
);

export default StatsTab;
