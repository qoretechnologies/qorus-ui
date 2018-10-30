import React from 'react';
import map from 'lodash/map';

import ChartComponent from '../chart';
import { getStatsCount, getStatsPct } from '../../helpers/chart';
import { DISPOSITIONS } from '../../constants/dashboard';
import { COLORS } from '../../constants/ui';
import { Callout, Icon, Popover, Position, Intent } from '@blueprintjs/core';
import mapProps from 'recompose/mapProps';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Link } from 'react-router';

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
  formatter: Object,
};

const DispositionChart: Function = ({
  stats,
  onDispositionChartClick,
  onSLAChartClick,
  dispositionLegendHandlers,
  slaLegendHandlers,
  autoRecoveriesCount,
  recoveryAmount,
  formatter,
}: Props) => (
  <div key={stats.label}>
    {autoRecoveriesCount > 0 &&
      recoveryAmount !== 0 && (
        <Callout iconName="dollar" className="pt-intent-purple">
          Estimated savings due to automatic order recovery for{' '}
          <strong>{autoRecoveriesCount}</strong> orders @{' '}
          <strong>{formatter.format(recoveryAmount)}</strong> / order ={' '}
          <strong>
            {formatter.format(recoveryAmount * autoRecoveriesCount)}
          </strong>
          <div
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              cursor: 'pointer',
              color: COLORS.purple,
            }}
          >
            <Popover
              isModal
              position={Position.RIGHT_TOP}
              useSmartPositioning
              content={
                <div style={{ width: '500px' }}>
                  <Callout
                    iconName="info-sign"
                    title="Automatic recovery info"
                    intent={Intent.PRIMARY}
                  >
                    <p>
                      Estimated savings are calculated based on the following
                      system options:{' '}
                      <Link to="/system/options?search=recovery-amount">
                        recovery-amount
                      </Link>{' '}
                      and{' '}
                      <Link to="/system/options?search=recovery-currency">
                        recovery-currency
                      </Link>
                      .
                    </p>
                    <p>
                      Each of these options must be set for individual
                      production environments based on the real costs of manual
                      error handling of workflow orders that get an ERROR
                      status.
                    </p>
                    <p>
                      Estimated savings are calculated by multiplying{' '}
                      <Link to="/system/options?search=recovery-amount">
                        recovery-amount
                      </Link>{' '}
                      by the number of automatically-recovered workflow orders
                      for the given time period and displayed in the currency
                      provided by{' '}
                      <Link to="/system/options?search=recovery-currency">
                        recovery-currency
                      </Link>{' '}
                      and do not include the costs related to orders with an
                      ERROR status requiring manual intervention. An accurate
                      estimated savings amount can only be provided by ensuring
                      that the{' '}
                      <Link to="/system/options?search=recovery-amount">
                        recovery-amount
                      </Link>{' '}
                      system option reflects real costs.
                    </p>
                    <p>
                      The purpose of this information is to show the value of
                      Qorus Integration Engine(R)’s automatic recovery of
                      technical errors in orchestrated tasks or workflows in
                      terms of real money saved by avoiding manual error
                      handling.
                    </p>
                    <p>
                      Should you not wish for this information to be displayed
                      in the Qorus Integration Engine(R) UI, please set the{' '}
                      <Link to="/system/options?search=recovery-amount">
                        recovery-amount
                      </Link>{' '}
                      option to 0.
                    </p>
                  </Callout>
                </div>
              }
            >
              <Icon iconName="help" />
            </Popover>
          </div>
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
    ({ statWithAutoRecoveries, recoveryCurrency, ...rest }: Props): Props => ({
      autoRecoveriesCount: statWithAutoRecoveries
        ? statWithAutoRecoveries.count
        : 0,
      formatter: new Intl.NumberFormat(navigator.language, {
        style: 'currency',
        currency: recoveryCurrency,
        minimumFractionDigits: 0,
      }),
      ...rest,
    })
  )
)(DispositionChart);
