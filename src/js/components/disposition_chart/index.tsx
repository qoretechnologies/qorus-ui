import { Callout, Icon, Intent, Popover, Position } from '@blueprintjs/core';
import map from 'lodash/map';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import { DISPOSITIONS } from '../../constants/dashboard';
import { COLORS } from '../../constants/ui';
import { getStatsCount, getStatsPct } from '../../helpers/chart';
import ChartComponent from '../chart';

type Props = {
  stats: any;
  onDispositionChartClick: Function;
  onSLAChartClick: Function;
  dispositionLegendHandlers: Array<Function>;
  slaLegendHandlers: Array<Function>;
  autoRecoveriesCount: number;
  statWithAutoRecoveries?: any;
  recoveryCurrency: string;
  recoveryAmount: number;
  options: any;
  formatter: any;
  intl: any;
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
  intl,
}: Props) => (
  // @ts-ignore ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Object'.
  <div key={stats.label}>
    {autoRecoveriesCount > 0 && recoveryAmount !== 0 && (
      <Callout icon="dollar" className="bp3-intent-purple">
        <FormattedMessage id="stats.estimated-savings-1" /> <strong>{autoRecoveriesCount}</strong>{' '}
        <FormattedMessage id="stats.estimated-savings-2" />{' '}
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'format' does not exist on type 'Object'. */}
        <strong>{formatter.format(recoveryAmount)}</strong>{' '}
        <FormattedMessage id="stats.estimated-savings-3" />{' '}
        <strong>
          {/* @ts-ignore ts-migrate(2339) FIXME: Property 'format' does not exist on type 'Object'. */}
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
            // @ts-ignore ts-migrate(2322) FIXME: Type '{ children: Element; isModal: true; position... Remove this comment to see the full error message
            isModal
            position={Position.RIGHT_TOP}
            useSmartPositioning
            content={
              <div style={{ width: '500px' }}>
                <Callout
                  icon="info-sign"
                  title={intl.formatMessage({ id: 'stats.automatic-recovery-info' })}
                  intent={Intent.PRIMARY}
                >
                  <p>
                    <FormattedMessage id="stats.estimated-savings-4" />{' '}
                    <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                    <FormattedMessage id="stats.and" />{' '}
                    <Link to="/system/options?search=recovery-currency">recovery-currency</Link>.
                  </p>
                  <p>
                    <FormattedMessage id="stats.estimated-savings-5" />
                  </p>
                  <p>
                    <FormattedMessage id="stats.estimated-savings-6" />{' '}
                    <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                    <FormattedMessage id="stats.estimated-savings-7" />{' '}
                    <Link to="/system/options?search=recovery-currency">recovery-currency</Link>{' '}
                    <FormattedMessage id="stats.estimated-savings-8" />{' '}
                    <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                    <FormattedMessage id="stats.estimated-savings-9" />
                  </p>
                  <p>
                    <FormattedMessage id="stats.estimated-savings-10" />
                  </p>
                  <p>
                    <FormattedMessage id="stats.estimated-savings-11" />{' '}
                    <Link to="/system/options?search=recovery-amount">recovery-amount</Link>{' '}
                    <FormattedMessage id="stats.estimated-savings-12" />
                  </p>
                </Callout>
              </div>
            }
          >
            <Icon icon="help" />
          </Popover>
        </div>
      </Callout>
    )}
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <ChartComponent
      title={intl.formatMessage({ id: 'stats.workflow-disposition' })}
      onClick={onDispositionChartClick}
      width={150}
      height={150}
      isNotTime
      type="doughnut"
      // @ts-ignore ts-migrate(2339) FIXME: Property 'l' does not exist on type 'Object'.
      empty={stats.l.every((stat) => stat.count === 0)}
      legendHandlers={dispositionLegendHandlers}
      labels={map(
        DISPOSITIONS,
        (label, disp) =>
          `${intl.formatMessage({ id: label })} (${Math.round(
            // @ts-ignore ts-migrate(2339) FIXME: Property 'l' does not exist on type 'Object'.
            stats.l.find((dt) => dt.disposition === disp)
              ? // @ts-ignore ts-migrate(2339) FIXME: Property 'l' does not exist on type 'Object'.
                stats.l.find((dt) => dt.disposition === disp).pct
              : 0
          )}%)`
      )}
      datasets={[
        {
          data: map(DISPOSITIONS, (label, disp) =>
            // @ts-ignore ts-migrate(2339) FIXME: Property 'l' does not exist on type 'Object'.
            stats.l.find((dt) => dt.disposition === disp)
              ? // @ts-ignore ts-migrate(2339) FIXME: Property 'l' does not exist on type 'Object'.
                stats.l.find((dt) => dt.disposition === disp).count
              : 0
          ),
          backgroundColor: [COLORS.purple, COLORS.danger, COLORS.green],
        },
      ]}
    />
    {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
    <ChartComponent
      title={intl.formatMessage({ id: 'stats.sla-stats' })}
      width={150}
      height={150}
      isNotTime
      type="doughnut"
      // @ts-ignore ts-migrate(2339) FIXME: Property 'sla' does not exist on type 'Object'.
      empty={stats.sla.every((sla: any) => sla.pct === 0)}
      onClick={onSLAChartClick}
      legendHandlers={slaLegendHandlers}
      labels={[
        intl.formatMessage({ id: 'stats.in-sla' }) + ` (${Math.round(getStatsPct(true, stats))}%)`,
        intl.formatMessage({ id: 'stats.out-of-sla' }) +
          ` (${Math.round(getStatsPct(false, stats))}%)`,
      ]}
      datasets={[
        {
          data: [Math.round(getStatsCount(true, stats)), Math.round(getStatsCount(false, stats))],
          backgroundColor: [COLORS.green, COLORS.danger],
        },
      ]}
    />
  </div>
);

export default compose(
  connect((state: any): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
    options: state.api.systemOptions.data,
  })),
  mapProps(
    ({ stats, options, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'l' does not exist on type 'Object'.
      statWithAutoRecoveries: stats.l.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'count' does not exist on type 'Object'.
        (stat: any) => stat.count > 0 && stat.disposition === 'A'
      ),
      stats,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'find' does not exist on type 'Object'.
      recoveryCurrency: options.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (option: any): boolean => option.name === 'recovery-currency'
      ).value,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'find' does not exist on type 'Object'.
      recoveryAmount: options.find(
        // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
        (option: any): boolean => option.name === 'recovery-amount'
      ).value,
      options,

      ...rest,
    })
  ),
  mapProps(
    // @ts-ignore ts-migrate(2741) FIXME: Property 'recoveryCurrency' is missing in type '{ ... Remove this comment to see the full error message
    ({ statWithAutoRecoveries, recoveryCurrency, ...rest }: Props): Props => ({
      autoRecoveriesCount: statWithAutoRecoveries
        ? // @ts-ignore ts-migrate(2339) FIXME: Property 'count' does not exist on type 'Object'.
          statWithAutoRecoveries.count
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
