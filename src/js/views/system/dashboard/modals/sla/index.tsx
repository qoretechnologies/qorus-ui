// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import Alert from '../../../../../components/alert';
import Box from '../../../../../components/box';
import Modal from '../../../../../components/modal';
import Tabs, { Pane } from '../../../../../components/tabs';
import { sortDefaults } from '../../../../../constants/sort';
import { orderStatsPct } from '../../../../../helpers/orders';
import sort from '../../../../../hocomponents/sort';
import sync from '../../../../../hocomponents/sync';
import actions from '../../../../../store/api/actions';
import Band from '../../../../../views/workflows/toolbar/band';
import SLATable from './table';

type Props = {
  onClose: Function;
  text: string;
  band: string;
  workflows: Array<Object>;
  totalOrderStats: number;
  onSortChange: Function;
  sortData: any;
  orderStats?: any;
};

const StatsModal: Function = ({
  onClose,
  text,
  band,
  workflows,
  totalOrderStats,
  onSortChange,
  sortData,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleBandChange' does not exist on type... Remove this comment to see the full error message
  handleBandChange,
}: Props) => (
  <Modal width={700}>
    <Modal.Header titleId="slamodal" onClose={onClose}>
      {text} for {band}
    </Modal.Header>
    <Modal.Body>
      <Box top fill>
        <Alert> {totalOrderStats} workflow orders processed </Alert>
        <Tabs
          active="local"
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          noContainer
          rightElement={<Band band={band} onChange={handleBandChange} />}
        >
          {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
          <Pane name="Local">
            <SLATable
              workflows={workflows}
              totalOrderStats={totalOrderStats}
              onSortChange={onSortChange}
              sortData={sortData}
              local
            />
          </Pane>
          {/* @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
          <Pane name="Global">
            <SLATable
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
    (state) => ({
      meta: state.api.workflows,
      workflows: state.api.workflows.data,
      orderStats: state.api.system.data.order_stats,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      load: actions.workflows.fetch,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      fetch: actions.workflows.fetch,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      unsync: actions.workflows.unsync,
    }
  ),
  sync('meta'),
  withState('band', 'changeBand', ({ band }) => band),
  withHandlers({
    handleBandChange:
      ({ changeBand }) =>
      (event, title) => {
        changeBand(title);
      },
  }),
  mapProps(
    ({ workflows, orderStats, band, ...rest }: Props): Props => ({
      totalOrderStats: orderStats
        // @ts-ignore ts-migrate(2339) FIXME: Property 'find' does not exist on type 'Object'.
        .find((stats) => stats.label === band.replace(/ /g, '_'))
        .sla.reduce((cur, sla) => cur + sla.count, 0),
      orderStats,
      band,
      workflows: workflows.filter(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
        ({ order_stats }) =>
          order_stats &&
          order_stats.find(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
            (stat: any) => stat.label === band.replace(/ /g, '_')
          )
      ),
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, band, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      workflows: workflows.map(({ id, normalizedName, order_stats }) => ({
        name: normalizedName,
        id,
        inSla: order_stats
          .find((stat) => stat.label === band.replace(/ /g, '_'))
          .sla.find((sla) => sla.in_sla).count,
        outOfSla: order_stats
          .find((stat) => stat.label === band.replace(/ /g, '_'))
          .sla.find((sla) => sla.in_sla === false).count,
      })),
      band,
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, totalOrderStats, ...rest }: Props): Props => ({
      workflows: workflows.map((workflow) => ({
        ...workflow,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'inSla' does not exist on type 'Object'.
        inSlaTotalPct: orderStatsPct(workflow.inSla, totalOrderStats),
        // @ts-ignore ts-migrate(2339) FIXME: Property 'outOfSla' does not exist on type 'Object... Remove this comment to see the full error message
        outOfSlaTotalPct: orderStatsPct(workflow.outOfSla, totalOrderStats),
        inSlaLocalPct: orderStatsPct(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'inSla' does not exist on type 'Object'.
          workflow.inSla,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'inSla' does not exist on type 'Object'.
          workflow.inSla + workflow.outOfSla
        ),
        outOfSlaLocalPct: orderStatsPct(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'outOfSla' does not exist on type 'Object... Remove this comment to see the full error message
          workflow.outOfSla,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'inSla' does not exist on type 'Object'.
          workflow.inSla + workflow.outOfSla
        ),
      })),
      totalOrderStats,
      ...rest,
    })
  ),
  sort('orderSLAModal', 'workflows', sortDefaults.orderSLAModal)
)(StatsModal);
