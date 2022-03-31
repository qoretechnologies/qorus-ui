// @flow
import { ProgressBar } from '@blueprintjs/core';
import replace from 'lodash/replace';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { ORDER_STATS_LEGEND } from '../../constants/orders';
import { orderStatsPctColorDisp } from '../../helpers/orders';
import Box from '../box';
import DispositionChart from '../disposition_chart';
import { MasonryLayout, MasonryPanel } from '../MasonryLayout';
import { Table, Tbody, Td, Th, Thead, Tr } from '../new_table';
import NoDataIf from '../NoDataIf';
import PaneItem from '../pane_item';

type Props = {
  orderStats: Array<Object>;
  renderRows: boolean;
};

const StatsTab: Function = ({
  orderStats,
  renderRows,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props): React.Element<any> => (
  <NoDataIf condition={!orderStats} big>
    {() => (
      <MasonryLayout columns={renderRows ? 1 : 3}>
        {orderStats.map(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
          ({ label, l, sla }: Object): any => (
            <MasonryPanel>
              <Box top>
                <PaneItem title={replace(label, /_/g, ' ')}>
                  <DispositionChart stats={{ ...{ label, l, sla } }} />
                  <Table condensed striped>
                    <Thead>
                      <Tr>
                        <Th className="name text">
                          <FormattedMessage id="stats.disposition" />
                        </Th>
                        <Th>
                          <FormattedMessage id="stats.count" />
                        </Th>
                        <Th>
                          <FormattedMessage id="stats.percentage" />
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {l.map((data: any) => (
                        <Tr>
                          <Td className="name text">
                            <FormattedMessage id={ORDER_STATS_LEGEND[data.disposition]} />
                          </Td>
                          <Td>{data.count}</Td>
                          <Td>
                            {Math.round(data.pct)}%{' '}
                            <ProgressBar
                              // @ts-ignore ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
                              intent={orderStatsPctColorDisp(data.disposition)}
                              value={Math.round(data.pct) / 100}
                              className={`bp3-no-animation ${
                                data.disposition === 'A' ? 'progress-bar-auto' : ''
                              }`}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </PaneItem>
              </Box>
            </MasonryPanel>
          )
        )}
      </MasonryLayout>
    )}
  </NoDataIf>
);

export default injectIntl(StatsTab);
