// @flow
import React from 'react';
import PaneItem from '../pane_item';

import Dropdown, { Item, Control } from '../dropdown';
import DispositionChart from '../disposition_chart';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

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
      <Dropdown>
        <Control small icon="time">
          {chartTab}
        </Control>
        <Item title="1 hour band" action={handleChartTabChange} />
        <Item title="4 hour band" action={handleChartTabChange} />
        <Item title="24 hour band" action={handleChartTabChange} />
      </Dropdown>
    }
  >
    {orderStats.map(
      stats =>
        stats.label.replace(/_/g, ' ') === chartTab && (
          <DispositionChart
            key={stats.label}
            stats={stats}
            onDispositionChartClick={onDispositionChartClick}
            dispositionLegendHandlers={dispositionLegendHandlers}
            onSLAChartClick={onSLAChartClick}
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
