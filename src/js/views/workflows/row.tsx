/* @flow */
import { Icon, Position, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import Box from '../../components/box';
import { IdColumn } from '../../components/IdColumn';
import InstancesBar from '../../components/instances_bar';
import InstancesChart from '../../components/instances_chart';
import NameColumn from '../../components/NameColumn';
import { Td, Tr } from '../../components/new_table';
import PaneItem from '../../components/pane_item';
import ProcessSummary from '../../components/ProcessSummary';
import { SelectColumn } from '../../components/SelectColumn';
import { ORDER_STATES_ARRAY } from '../../constants/orders';
import {
  buildOrderStatsDisposition,
  buildOrderStatsSLA,
} from '../../helpers/workflows';
import withDispatch from '../../hocomponents/withDispatch';
import AutoStart from './autostart';
import WorkflowControls from './controls';

type Props = {
  isActive?: boolean,
  date: string,
  openPane: Function,
  closePane: Function,
  select: Function,
  handleCheckboxClick: Function,
  handleHighlightEnd: Function,
  handleDetailClick: Function,
  handleSlaBarClick: Function,
  handleAutostartChange: Function,
  updateDone: Function,
  id: number,
  _selected: boolean,
  _updated: boolean,
  enabled: boolean,
  autostart: number,
  exec_count: number,
  has_alerts: boolean,
  name: string,
  version: string,
  states: Object,
  expanded: boolean,
  deprecated: boolean,
  showDeprecated: boolean,
  isTablet?: boolean,
  first?: boolean,
  remote: boolean,
  dispatchAction: Function,
  order_stats?: Object,
  orderStats?: Object,
  slaStats?: Object,
  totalOrderStats: number,
  totalSlaStats: number,
  band: string,
};

const TableRow: Function = ({
  isActive,
  date,
  handleCheckboxClick,
  handleDetailClick,
  handleSlaBarClick,
  handleHighlightEnd,
  id,
  _selected,
  _updated,
  enabled,
  autostart,
  exec_count: execs,
  has_alerts: hasAlerts,
  states,
  deprecated,
  showDeprecated,
  isTablet,
  first,
  remote,
  orderStats,
  totalOrderStats,
  slaStats,
  totalSlaStats,
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
  intl,
  ...rest
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Tr
    first={first}
    className={classNames({
      'row-alert': hasAlerts,
      'row-selected': _selected,
      'row-active': isActive,
    })}
    onClick={handleCheckboxClick}
    onHighlightEnd={handleHighlightEnd}
    highlight={_updated}
  >
    <SelectColumn onClick={handleCheckboxClick} checked={_selected} />
    <IdColumn>{id}</IdColumn>
    <NameColumn
      popoverContent={
        <Box top>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'normalizedName' does not exist on type '... Remove this comment to see the full error message */ }
          <PaneItem title={rest.normalizedName}>{rest.description}</PaneItem>
          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type '{ openPan... Remove this comment to see the full error message */ }
          {rest.TOTAL > 0 && (
            <PaneItem title={intl.formatMessage({ id: 'table.instances' })}>
              <InstancesChart width={400} states={states} instances={rest} />
            </PaneItem>
          )}
          <ProcessSummary
            model={{ enabled, remote, autostart, ...rest }}
            type="workflow"
          />
        </Box>
      }
      link={`/workflow/${id}?date=${date}`}
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'normalizedName' does not exist on type '... Remove this comment to see the full error message
      name={rest.normalizedName}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      hasAlerts={hasAlerts}
      type="workflow"
    />
    <Td key="controls" className="normal">
      <WorkflowControls id={id} enabled={enabled} remote={remote} />
    </Td>
    <Td key="autostart" name="autostart" className="medium">
      <AutoStart id={id} autostart={autostart} execCount={execs} />
    </Td>
    {showDeprecated && (
      <Td className="medium">
        <Icon icon={deprecated ? 'small-tick' : 'cross'} />
      </Td>
    )}
    <Td className="huge separated-cell">
      <InstancesBar
        states={states}
        instances={rest}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type '{ openPan... Remove this comment to see the full error message
        totalInstances={rest.TOTAL}
        id={id}
        date={date}
      />
    </Td>
    <Td className="narrow">
      { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type '{ openPan... Remove this comment to see the full error message */ }
      <Tooltip content={rest.TOTAL || 0} position={Position.TOP}>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type '{ openPan... Remove this comment to see the full error message */ }
        <Link to={`/workflow/${id}?date=${date}`}>{rest.TOTAL || 0}</Link>
      </Tooltip>
    </Td>
    <Td className="big separated-cell">
      <InstancesBar
        states={[
          { name: 'completed', label: 'complete' },
          { name: 'automatically', label: 'automatic' },
          { name: 'manually', label: 'error' },
        ]}
        instances={orderStats}
        totalInstances={totalOrderStats}
        workflowId={id}
        showPct
        minWidth={25}
        onClick={handleSlaBarClick}
      />
    </Td>
    <Td className="normal">
      <InstancesBar
        states={[
          { name: 'In SLA', label: 'complete' },
          { name: 'Out of SLA', label: 'error' },
        ]}
        showPct
        minWidth={25}
        instances={slaStats}
        totalInstances={totalSlaStats}
        workflowId={id}
        onClick={handleSlaBarClick}
      />
    </Td>
  </Tr>
);

export default compose(
  withDispatch(),
  withHandlers({
    handleCheckboxClick: ({ select, id }: Props): Function => (): void => {
      select(id);
    },
    handleHighlightEnd: ({ updateDone, id }: Props): Function => (): void => {
      updateDone(id);
    },
    handleDetailClick: ({
      openPane,
      id,
      closePane,
      isActive,
    }: Props): Function => (): void => {
      if (isActive) {
        closePane(['globalErrQuery', 'workflowErrQuery']);
      } else {
        openPane(id);
      }
    },
    handleSlaBarClick: ({
      openPane,
      id,
      closePane,
      isActive,
    }: Props): Function => (event: Object): void => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'stopPropagation' does not exist on type ... Remove this comment to see the full error message
      event.stopPropagation();

      if (isActive) {
        closePane(['globalErrQuery', 'workflowErrQuery']);
      } else {
        openPane(id, 'order stats');
      }
    },
  }),
  // @ts-expect-error ts-migrate(2741) FIXME: Property 'band' is missing in type '{ isActive?: b... Remove this comment to see the full error message
  mapProps(({ order_stats: orderStats, band, ...rest }: Props): Props => ({
    orderStats: orderStats && buildOrderStatsDisposition(orderStats, band),
    slaStats: orderStats && buildOrderStatsSLA(orderStats, band),
    ...rest,
  })),
  mapProps(({ orderStats, slaStats, ...rest }: Props): Props => ({
    totalOrderStats: orderStats
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'completed' does not exist on type 'Objec... Remove this comment to see the full error message
      ? orderStats.completed + orderStats.automatically + orderStats.manually
      : 0,
    totalSlaStats: slaStats ? slaStats['In SLA'] + slaStats['Out of SLA'] : 0,
    orderStats,
    slaStats,
    ...rest,
  })),
  pure([
    'isActive',
    'date',
    '_selected',
    '_updated',
    'enabled',
    'autostart',
    'exec_count',
    'states',
    'showDeprecated',
    'deprecated',
    'expanded',
    'TOTAL',
    'isTablet',
    'remote',
    'order_stats',
    'orderStats',
    'band',
    ...ORDER_STATES_ARRAY,
  ]),
  injectIntl
)(TableRow);
