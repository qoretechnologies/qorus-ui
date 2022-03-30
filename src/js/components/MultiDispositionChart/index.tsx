// @flow
import React from 'react';
import PaneItem from '../pane_item';

import DispositionChart from '../disposition_chart';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import BandDropdown from './dropdown';

type Props = {
  orderStats: Array<Object>,
  chartTab: string,
  handleChartTabChange: Function,
  onDispositionChartClick: Function,
  dispositionLegendHandlers: Array<Function>,
  onSLAChartClick: Function,
  changeChartTab: Function,
  title: string,
};

const MultiDispostionChart: Function = ({
  orderStats,
  chartTab,
  handleChartTabChange,
  onDispositionChartClick,
  dispositionLegendHandlers,
  onSLAChartClick,
  title,
}: Props) => (
  <PaneItem
    title={title}
    label={
      <BandDropdown
        chartTab={chartTab}
        onChartTabChange={handleChartTabChange}
      />
    }
  >
    {orderStats.map(
      stats =>
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
        stats.label.replace(/_/g, ' ') === chartTab && (
          <DispositionChart
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
            key={stats.label}
            stats={stats}
            onDispositionChartClick={() => {
              onDispositionChartClick(chartTab);
            }}
            onSLAChartClick={() => {
              onSLAChartClick(chartTab);
            }}
          />
        )
    )}
  </PaneItem>
);

export default compose(
  withState(
    'chartTab',
    'changeChartTab',
    ({ defaultBand }) => defaultBand || '1 hour band'
  ),
  withHandlers({
    handleChartTabChange: ({ changeChartTab }: Props): Function => (
      event,
      band: string
    ): void => {
      changeChartTab(() => band);
    },
  }),
  onlyUpdateForKeys(['title', 'chartTab', 'orderStats'])
)(MultiDispostionChart);
