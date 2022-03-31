// @flow
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import withState from 'recompose/withState';
import { connect } from '../../../../../../../node_modules/react-redux';
import mapProps from '../../../../../../../node_modules/recompose/mapProps';
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
import GlobalTable from './table';

type Props = {
  onClose: Function;
  text: string;
  band: string;
  disposition: string;
  workflows: Array<Object>;
  totalOrderStats: number;
  sortData: Object;
  onSortChange: Function;
  orderStats: Array<Object>;
};

const StatsModal: Function = ({
  onClose,
  text,
  band,
  workflows,
  totalOrderStats,
  sortData,
  onSortChange,
  // @ts-ignore ts-migrate(2339) FIXME: Property 'handleBandChange' does not exist on type... Remove this comment to see the full error message
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
          // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
          noContainer
          rightElement={<Band band={band} onChange={handleBandChange} />}
        >
          {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
          <Pane name="Local">
            <GlobalTable
              workflows={workflows}
              totalOrderStats={totalOrderStats}
              onSortChange={onSortChange}
              sortData={sortData}
              local
            />
          </Pane>
          {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; name: string; }' is not... Remove this comment to see the full error message */}
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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
        .find((stats) => stats.label === band.replace(/ /g, '_'))
        // @ts-ignore ts-migrate(2339) FIXME: Property 'l' does not exist on type 'Object'.
        .l.reduce((cur, disp) => cur + disp.count, 0),
      workflows: workflows.filter(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
        ({ order_stats }) =>
          order_stats &&
          order_stats.find(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      workflows: workflows.map(({ id, normalizedName, order_stats }) => ({
        name: normalizedName,
        id,
        completed: order_stats
          .find((stat) => stat.label === band.replace(/ /g, '_'))
          .l.find((disp) => disp.disposition === 'C').count,
        automatically: order_stats
          .find((stat) => stat.label === band.replace(/ /g, '_'))
          .l.find((disp) => disp.disposition === 'A').count,
        manually: order_stats
          .find((stat) => stat.label === band.replace(/ /g, '_'))
          .l.find((disp) => disp.disposition === 'M').count,
      })),
      band,
      ...rest,
    })
  ),
  mapProps(
    ({ workflows, totalOrderStats, ...rest }: Props): Props => ({
      workflows: workflows.map((workflow) => ({
        ...workflow,
        // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
        completedTotalPct: orderStatsPct(workflow.completed, totalOrderStats),
        automaticallyTotalPct: orderStatsPct(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message
          workflow.automatically,
          totalOrderStats
        ),
        // @ts-ignore ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message
        manuallyTotalPct: orderStatsPct(workflow.manually, totalOrderStats),
        completedLocalPct: orderStatsPct(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
          workflow.completed,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
          workflow.completed + workflow.automatically + workflow.manually
        ),
        automaticallyLocalPct: orderStatsPct(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'automatically' does not exist on type 'O... Remove this comment to see the full error message
          workflow.automatically,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
          workflow.completed + workflow.automatically + workflow.manually
        ),
        manuallyLocalPct: orderStatsPct(
          // @ts-ignore ts-migrate(2339) FIXME: Property 'manually' does not exist on type 'Object... Remove this comment to see the full error message
          workflow.manually,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
          workflow.completed + workflow.automatically + workflow.manually
        ),
      })),
      totalOrderStats,
      ...rest,
    })
  ),
  sort('orderStatsModal', 'workflows', sortDefaults.orderStatsModal)
)(StatsModal);
