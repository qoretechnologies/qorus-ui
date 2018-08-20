import React from 'react';
import { ProgressBar, Intent, Tag, Icon } from '@blueprintjs/core';

import { Table, Thead, Tr, Th, Tbody } from '../../../components/new_table';
import NoData from '../../../components/nodata';
import replace from 'lodash/replace';
import { Td } from '../../../components/table';
import PaneItem from '../../../components/pane_item';
import { ORDER_STATS_LEGEND } from '../../../constants/orders';
import {
  orderStatsPctColor,
  orderStatsPctColorDisp,
} from '../../../helpers/orders';

type Props = {
  orderStats: Array<Object>,
};

const StatsTab: Function = ({ orderStats }: Props): any =>
  orderStats ? (
    <div>
      {orderStats.map(
        ({ label, l, sla }: Object): any => (
          <PaneItem
            title={
              sla.length !== 0 ? (
                <div>
                  <span style={{ paddingRight: '10px' }}>
                    {replace(label, /_/g, ' ')}
                  </span>
                  <Tag
                    className="pt-minimal"
                    intent={sla[0].in_sla ? Intent.SUCCESS : Intent.DANGER}
                  >
                    In SLA:{' '}
                    <Icon iconName={sla[0].in_sla ? 'small-tick' : 'cross'} />
                  </Tag>{' '}
                  <Tag className="pt-minimal">
                    Count: {Math.round(sla[0].count)}
                  </Tag>{' '}
                  <Tag
                    className="pt-minimal"
                    intent={orderStatsPctColor(sla[0].pct)}
                  >
                    Percentage: {Math.round(sla[0].pct)}%
                  </Tag>
                </div>
              ) : (
                replace(label, /_/g, ' ')
              )
            }
          >
            <Table condensed striped bordered>
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
  ) : (
    <NoData />
  );

export default StatsTab;
