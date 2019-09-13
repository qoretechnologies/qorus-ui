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
import { injectIntl, FormattedMessage } from 'react-intl';

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
  intl: any
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
  intl
}: Props) => (
  <div key={stats.label}>
    {autoRecoveriesCount > 0 && recoveryAmount !== 0 &&
      (
        <Callout iconName="dollar" className="pt-intent-purple">
          <FormattedMessage id='stats.estimated-savings-1' />{' '}
          <strong>{autoRecoveriesCount}</strong>{' '}
          <FormattedMessage id='stats.estimated-savings-2' />{' '}
          <strong>{formatter.format(recoveryAmount)}</strong>{' '}
          <FormattedMessage id='stats.estimated-savings-3' />{' '}
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
                    title={intl.formatMessage({ id: 'stats.automatic-recovery-info' })}
                    intent={Intent.PRIMARY}
                  >
                    <p>
                      <FormattedMessage id='stats.estimated-savings-4' />{' '}
                      <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                      <FormattedMessage id='stats.and' />{' '}
                      <Link to="/system/options?search=recovery-currency">recovery-currency</Link>
                      .
                    </p>
                    <p>
                      <FormattedMessage id='stats.estimated-savings-5' />
                    </p>
                    <p>
                      <FormattedMessage id='stats.estimated-savings-6' />{' '}
                      <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                      <FormattedMessage id='stats.estimated-savings-7' />{' '}
                      <Link to="/system/options?search=recovery-currency">recovery-currency</Link>{' '}
                      <FormattedMessage id='stats.estimated-savings-8' />{' '}
                      <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                      <FormattedMessage id='stats.estimated-savings-9' />
                    </p>
                    <p>
                      <FormattedMessage id='stats.estimated-savings-10' />
                    </p>
                    <p>
                      <FormattedMessage id='stats.estimated-savings-11' />{' '}
                      <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                      <FormattedMessage id='stats.estimated-savings-12' />
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
      title={intl.formatMessage({ id: 'stats.workflow-disposition' })}
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
          `${intl.formatMessage({ id: label })} (${Math.round(
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
      title={intl.formatMessage({ id: 'stats.sla-stats' })}
      width={150}
      height={150}
      isNotTime
      type="doughnut"
      empty={stats.sla.every((sla: Object) => sla.pct === 0)}
      onClick={onSLAChartClick}
      legendHandlers={slaLegendHandlers}
      labels={[
        intl.formatMessage({ id: 'stats.in-sla' }) + ` (${Math.round(getStatsPct(true, stats))}%)`,
        intl.formatMessage({ id: 'stats.out-of-sla' }) + ` (${Math.round(getStatsPct(false, stats))}%)`,
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
  ),
  injectIntl
)(DispositionChart);
