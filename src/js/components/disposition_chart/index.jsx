import React from 'react';
import map from 'lodash/map';

import ChartComponent from '../chart';
import { getStatsCount, getStatsPct } from '../../helpers/chart';
import { DISPOSITIONS } from '../../constants/dashboard';
import { COLORS } from '../../constants/ui';
import { Callout } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import { connect } from 'react-redux';

type Props = {
  stats: Object,
  onDispositionChartClick: Function,
  onSLAChartClick: Function,
  dispositionLegendHandlers: Array<Function>,
  slaLegendHandlers: Array<Function>,
  autoRecoveriesCount: number,
  statWithAutoRecoveries?: Object,
  recoveryCurrency: string,
  recoveryAmount: number,
  options: Object,
};

const DispositionChart: Function = ({
  stats,
  onDispositionChartClick,
  onSLAChartClick,
  dispositionLegendHandlers,
  slaLegendHandlers,
  autoRecoveriesCount,
  recoveryCurrency,
  recoveryAmount,
}: Props) => (
  <div key={stats.label}>
    {autoRecoveriesCount > 0 && (
      <Callout iconName="dollar" className="pt-intent-purple">
        There are <strong>{autoRecoveriesCount}</strong> orders that were
        recovered <strong>automatically</strong>, saving you a total of{' '}
        <strong>
          {recoveryAmount * autoRecoveriesCount} {recoveryCurrency}
        </strong>
      </Callout>
    )}
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
          backgroundColor: [COLORS.purple, COLORS.danger, COLORS.green],
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
          backgroundColor: [COLORS.green, COLORS.danger],
        },
      ]}
    />
  </div>
);

export default compose(
  connect(
    (state: Object): Object => ({
      options: state.api.systemOptions.data,
    })
  ),
  mapProps(
    ({ stats, options, ...rest }: Props): Props => ({
      statWithAutoRecoveries: stats.l.find(
        (stat: Object) => stat.count > 0 && stat.disposition === 'A'
      ),
      stats,
      recoveryCurrency: options.find(
        (option: Object): boolean => option.name === 'recovery-currency'
      ).value,
      recoveryAmount: options.find(
        (option: Object): boolean => option.name === 'recovery-amount'
      ).value,
      options,
      ...rest,
    })
  ),
  mapProps(
    ({ statWithAutoRecoveries, ...rest }: Props): Props => ({
      autoRecoveriesCount: statWithAutoRecoveries
        ? statWithAutoRecoveries.count
        : 0,
      ...rest,
    })
  )
)(DispositionChart);
