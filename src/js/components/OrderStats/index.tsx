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
import Box from '../box';
import { MasonryLayout, MasonryPanel } from '../MasonryLayout';
import { injectIntl, FormattedMessage } from 'react-intl';

type Props = {
  orderStats: Array<Object>,
  renderRows: boolean,
};

const StatsTab: Function = ({
  orderStats,
  renderRows,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <NoDataIf condition={!orderStats} big>
    {() => (
      <MasonryLayout columns={renderRows ? 1 : 3}>
        {orderStats.map(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
          ({ label, l, sla }: Object): any => (
            <MasonryPanel>
              <Box top>
                <PaneItem title={replace(label, /_/g, ' ')}>
                  <DispositionChart stats={{ ...{ label, l, sla } }} />
                  <Table condensed striped>
                    <Thead>
                      <Tr>
                        <Th className="name text">
                          <FormattedMessage id='stats.disposition' />
                        </Th>
                        <Th><FormattedMessage id='stats.count' /></Th>
                        <Th><FormattedMessage id='stats.percentage' /></Th>
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
                              // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'Intent'.
                              intent={orderStatsPctColorDisp(data.disposition)}
                              value={Math.round(data.pct) / 100}
                              className={`bp3-no-animation ${
                                data.disposition === 'A'
                                  ? 'progress-bar-auto'
                                  : ''
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
