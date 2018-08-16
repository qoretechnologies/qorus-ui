// @flow
import React from 'react';
import compose from 'recompose/compose';
import { Link } from 'react-router';

import Modal from '../../../components/modal';
import { Table, Thead, Tbody, Th, Tr, Td } from '../../../components/new_table';
import { connect } from '../../../../../node_modules/react-redux';
import actions from '../../../store/api/actions';
import sync from '../../../hocomponents/sync';
import mapProps from '../../../../../node_modules/recompose/mapProps';
import { ProgressBar } from '../../../../../node_modules/@blueprintjs/core';
import { orderStatsPctColor, orderStatsPct } from '../../../helpers/orders';
import Box from '../../../components/box';
import sort from '../../../hocomponents/sort';
import { sortDefaults } from '../../../constants/sort';

type Props = {
  onClose: Function,
  text: string,
  band: string,
  disposition: string,
  workflows: Array<Object>,
  totalOrderStats: number,
  sortData: Object,
  onSortChange: Function,
  orderStats: Array<Object>,
};

const StatsModal: Function = ({
  onClose,
  text,
  band,
  workflows,
  totalOrderStats,
  sortData,
  onSortChange,
}: Props) => (
  <Modal width={700}>
    <Modal.Header title="statsmodal" onClose={onClose}>
      {text} for {band}
    </Modal.Header>
    <Modal.Body>
      <h5> Total {totalOrderStats} workflow orders </h5>
      <Box noPadding top>
        <Table condensed striped height={400}>
          <Thead>
            <Tr {...{ sortData, onSortChange }}>
              <Th className="name" name="name">
                Name
              </Th>
              <Th name="completed">C (No errors)</Th>
              <Th name="automatically">A (Recovered Automatically)</Th>
              <Th name="manually">M (Recovered Manually)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {workflows.map((workflow: Object) => (
              <Tr key={workflow.id}>
                <Td className="name">
                  <Link to={`/workflows?paneId${workflow.id}`}>
                    {workflow.name}
                  </Link>
                </Td>
                <Td>
                  {workflow.completed} (
                  {orderStatsPct(workflow.completed, totalOrderStats)}
                  %)
                  <ProgressBar
                    intent={orderStatsPctColor(
                      orderStatsPct(workflow.completed, totalOrderStats)
                    )}
                    value={
                      orderStatsPct(workflow.completed, totalOrderStats) / 100
                    }
                    className="pt-no-animation"
                  />
                </Td>
                <Td>
                  {workflow.automatically} (
                  {orderStatsPct(workflow.automatically, totalOrderStats)}
                  %)
                  <ProgressBar
                    intent={orderStatsPctColor(
                      orderStatsPct(workflow.automatically, totalOrderStats)
                    )}
                    value={
                      orderStatsPct(workflow.automatically, totalOrderStats) /
                      100
                    }
                    className="pt-no-animation"
                  />
                </Td>
                <Td>
                  {workflow.manually} (
                  {orderStatsPct(workflow.manually, totalOrderStats)}
                  %)
                  <ProgressBar
                    intent={orderStatsPctColor(
                      orderStatsPct(workflow.manually, totalOrderStats)
                    )}
                    value={
                      orderStatsPct(workflow.manually, totalOrderStats) / 100
                    }
                    className="pt-no-animation"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Modal.Body>
  </Modal>
);

export default compose(
  connect(
    state => ({
      meta: state.api.workflows,
      workflows: state.api.workflows.data,
      orderStats: state.api.system.data.order_stats,
    }),
    {
      load: actions.workflows.fetch,
      fetch: actions.workflows.fetch,
      unsync: actions.workflows.unsync,
    }
  ),
  sync('meta'),
  mapProps(
    ({ workflows, orderStats, band, ...rest }: Props): Props => ({
      totalOrderStats: orderStats
        .find(stats => stats.label === band.replace(/ /g, '_'))
        .l.reduce((cur, disp) => cur + disp.count, 0),
      workflows: workflows.filter(
        ({ order_stats }) =>
          order_stats &&
          order_stats.find(
            (stat: Object) => stat.label === band.replace(/ /g, '_')
          )
      ),
      orderStats,
      band,
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, band, ...rest }: Props): Props => ({
      workflows: workflows.map(({ id, normalizedName, order_stats }) => ({
        name: normalizedName,
        id,
        completed: order_stats
          .find(stat => stat.label === band.replace(/ /g, '_'))
          .l.find(disp => disp.disposition === 'C').count,
        automatically: order_stats
          .find(stat => stat.label === band.replace(/ /g, '_'))
          .l.find(disp => disp.disposition === 'A').count,
        manually: order_stats
          .find(stat => stat.label === band.replace(/ /g, '_'))
          .l.find(disp => disp.disposition === 'M').count,
      })),
      band,
      ...rest,
    })
  ),
  sort('orderStatsModal', 'workflows', sortDefaults.orderStatsModal)
)(StatsModal);
