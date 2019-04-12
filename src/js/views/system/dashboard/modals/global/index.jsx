// @flow
import React from 'react';
import compose from 'recompose/compose';

import Modal from '../../../../../components/modal';
import Tabs, { Pane } from '../../../../../components/tabs';
import { connect } from '../../../../../../../node_modules/react-redux';
import actions from '../../../../../store/api/actions';
import sync from '../../../../../hocomponents/sync';
import mapProps from '../../../../../../../node_modules/recompose/mapProps';
import Box from '../../../../../components/box';
import sort from '../../../../../hocomponents/sort';
import { sortDefaults } from '../../../../../constants/sort';
import GlobalTable from './table';
import { orderStatsPct } from '../../../../../helpers/orders';
import Alert from '../../../../../components/alert';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import Band from '../../../../../views/workflows/toolbar/band';

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
  handleBandChange,
}: Props) => (
  <Modal width={700}>
    <Modal.Header title="statsmodal" onClose={onClose}>
      {text} for {band}
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        <Alert> {totalOrderStats} workflow orders processed </Alert>
        <Tabs
          active="local"
          noContainer
          rightElement={<Band band={band} onChange={handleBandChange} />}
        >
          <Pane name="Local">
            <GlobalTable
              workflows={workflows}
              totalOrderStats={totalOrderStats}
              onSortChange={onSortChange}
              sortData={sortData}
              local
            />
          </Pane>
          <Pane name="Global">
            <GlobalTable
              workflows={workflows}
              totalOrderStats={totalOrderStats}
              onSortChange={onSortChange}
              sortData={sortData}
            />
          </Pane>
        </Tabs>
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
  withState('band', 'changeBand', ({ band }) => band),
  withHandlers({
    handleBandChange: ({ changeBand }) => (event, title) => {
      changeBand(title);
    },
  }),
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
  mapProps(
    ({ workflows, totalOrderStats, ...rest }: Props): Props => ({
      workflows: workflows.map(workflow => ({
        ...workflow,
        completedTotalPct: orderStatsPct(workflow.completed, totalOrderStats),
        automaticallyTotalPct: orderStatsPct(
          workflow.automatically,
          totalOrderStats
        ),
        manuallyTotalPct: orderStatsPct(workflow.manually, totalOrderStats),
        completedLocalPct: orderStatsPct(
          workflow.completed,
          workflow.completed + workflow.automatically + workflow.manually
        ),
        automaticallyLocalPct: orderStatsPct(
          workflow.automatically,
          workflow.completed + workflow.automatically + workflow.manually
        ),
        manuallyLocalPct: orderStatsPct(
          workflow.manually,
          workflow.completed + workflow.automatically + workflow.manually
        ),
      })),
      totalOrderStats,
      ...rest,
    })
  ),
  sort('orderStatsModal', 'workflows', sortDefaults.orderStatsModal)
)(StatsModal);
