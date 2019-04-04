// @flow
import React from 'react';
import compose from 'recompose/compose';

import Modal from '../../../../../components/modal';
import { connect } from 'react-redux';
import actions from '../../../../../store/api/actions';
import sync from '../../../../../hocomponents/sync';
import mapProps from 'recompose/mapProps';
import Box from '../../../../../components/box';
import Tabs, { Pane } from '../../../../../components/tabs';
import SLATable from './table';
import { sortDefaults } from '../../../../../constants/sort';
import sort from '../../../../../hocomponents/sort';
import { orderStatsPct } from '../../../../../helpers/orders';
import Alert from '../../../../../components/alert';

type Props = {
  onClose: Function,
  text: string,
  band: string,
  workflows: Array<Object>,
  totalOrderStats: number,
  onSortChange: Function,
  sortData: Object,
  orderStats?: Object,
};

const StatsModal: Function = ({
  onClose,
  text,
  band,
  workflows,
  totalOrderStats,
  onSortChange,
  sortData,
}: Props) => (
  <Modal width={700}>
    <Modal.Header titleId="slamodal" onClose={onClose}>
      {text} for {band}
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        <Alert> {totalOrderStats} workflow orders processed </Alert>
        <Tabs active="global" noContainer>
          <Pane name="Global">
            <SLATable
              workflows={workflows}
              totalOrderStats={totalOrderStats}
              onSortChange={onSortChange}
              sortData={sortData}
            />
          </Pane>
          <Pane name="Local">
            <SLATable
              workflows={workflows}
              totalOrderStats={totalOrderStats}
              onSortChange={onSortChange}
              sortData={sortData}
              local
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
  mapProps(
    ({ workflows, orderStats, band, ...rest }: Props): Props => ({
      totalOrderStats: orderStats
        .find(stats => stats.label === band.replace(/ /g, '_'))
        .sla.reduce((cur, sla) => cur + sla.count, 0),
      orderStats,
      band,
      workflows: workflows.filter(
        ({ order_stats }) =>
          order_stats &&
          order_stats.find(
            (stat: Object) => stat.label === band.replace(/ /g, '_')
          )
      ),
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, band, ...rest }: Props): Props => ({
      workflows: workflows.map(({ id, normalizedName, order_stats }) => ({
        name: normalizedName,
        id,
        inSla: order_stats
          .find(stat => stat.label === band.replace(/ /g, '_'))
          .sla.find(sla => sla.in_sla).count,
        outOfSla: order_stats
          .find(stat => stat.label === band.replace(/ /g, '_'))
          .sla.find(sla => sla.in_sla === false).count,
      })),
      band,
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, totalOrderStats, ...rest }: Props): Props => ({
      workflows: workflows.map(workflow => ({
        ...workflow,
        inSlaTotalPct: orderStatsPct(workflow.inSla, totalOrderStats),
        outOfSlaTotalPct: orderStatsPct(workflow.outOfSla, totalOrderStats),
        inSlaLocalPct: orderStatsPct(
          workflow.inSla,
          workflow.inSla + workflow.outOfSla
        ),
        outOfSlaLocalPct: orderStatsPct(
          workflow.outOfSla,
          workflow.inSla + workflow.outOfSla
        ),
      })),
      totalOrderStats,
      ...rest,
    })
  ),
  sort('orderSLAModal', 'workflows', sortDefaults.orderSLAModal)
)(StatsModal);
