import React from 'react';
import map from 'lodash/map';

import ChartComponent from '../chart';
import { getStatsCount, getStatsPct } from '../../helpers/chart';
import { DISPOSITIONS } from '../../constants/dashboard';

type Props = {
  stats: Object,
  onDispositionChartClick: Function,
  onSLAChartClick: Function,
  dispositionLegendHandlers: Array<Function>,
  slaLegendHandlers: Array<Function>,
};

const DispositionChart: Function = ({
  stats,
  onDispositionChartClick,
  onSLAChartClick,
  dispositionLegendHandlers,
  slaLegendHandlers,
}: Props) => (
  <div key={stats.label}>
    <ChartComponent
      title="Workflow Disposition"
      onClick={onDispositionChartClick}
      width={150}
      height={150}
      isNotTime
      type="doughnut"
      empty={stats.l.every(stat => stat.count === 0)}
      legendHandlers={dispositionLegendHandlers}
      labels={map(
        DISPOSITIONS,
        (label, disp) =>
          `${label} (${Math.round(
            stats.l.find(dt => dt.disposition === disp)
              ? stats.l.find(dt => dt.disposition === disp).pct
              : 0
          )}%)`
      )}
      datasets={[
        {
          data: map(
            DISPOSITIONS,
            (label, disp) =>
              stats.l.find(dt => dt.disposition === disp)
                ? stats.l.find(dt => dt.disposition === disp).count
                : 0
          ),
          backgroundColor: ['#81358a', '#FF7373', '#7fba27'],
        },
      ]}
    />
    <ChartComponent
      title="SLA Stats"
      width={150}
      height={150}
      isNotTime
      type="doughnut"
      empty={stats.sla.every((sla: Object) => sla.pct === 0)}
      onClick={onSLAChartClick}
      legendHandlers={slaLegendHandlers}
      labels={[
        `In SLA (${Math.round(getStatsPct(true, stats))}%)`,
        `Out of SLA (${Math.round(getStatsPct(false, stats))}%)`,
      ]}
      datasets={[
        {
          data: [
            Math.round(getStatsCount(true, stats)),
            Math.round(getStatsCount(false, stats)),
          ],
          backgroundColor: ['#7fba27', '#FF7373'],
        },
      ]}
    />
  </div>
);

export default DispositionChart;
