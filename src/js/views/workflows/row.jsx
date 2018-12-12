/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';
import classNames from 'classnames';
import { Tooltip, Position, Icon } from '@blueprintjs/core';

import { Tr, Td } from '../../components/new_table';
import Box from '../../components/box';
import PaneItem from '../../components/pane_item';
import Checkbox from '../../components/checkbox';
import WorkflowControls from './controls';

import AutoStart from './autostart';
import { ORDER_STATES_ARRAY } from '../../constants/orders';
import InstancesBar from '../../components/instances_bar';
import InstancesChart from '../../components/instances_chart';
import ProcessSummary from '../../components/ProcessSummary';
import mapProps from 'recompose/mapProps';
import withDispatch from '../../hocomponents/withDispatch';
import NameColumn from '../../components/NameColumn';
import {
  buildOrderStatsDisposition,
  buildOrderStatsSLA,
} from '../../helpers/workflows';

type Props = {
  isActive?: boolean,
  date: string,
  openPane: Function,
  closePane: Function,
  select: Function,
  handleCheckboxClick: Function,
  handleHighlightEnd: Function,
  handleDetailClick: Function,
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
  ...rest
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
    <Td key="checkbox" className="tiny checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    {!isTablet && (
      <Td key="controls" className="normal">
        <WorkflowControls id={id} enabled={enabled} remote={remote} />
      </Td>
    )}
    <Td key="autostart" name="autostart" className="medium">
      <AutoStart id={id} autostart={autostart} execCount={execs} />
    </Td>
    <Td className="narrow">{id}</Td>
    <NameColumn
      popoverContent={
        <Box top>
          <PaneItem title={rest.normalizedName}>{rest.description}</PaneItem>
          {rest.TOTAL > 0 && (
            <PaneItem title="Instances">
              <InstancesChart width={400} states={states} instances={rest} />
            </PaneItem>
          )}
          <ProcessSummary process={rest.process} />
        </Box>
      }
      link={`/workflow/${id}?date=${date}`}
      name={rest.normalizedName}
      isActive={isActive}
      onDetailClick={handleDetailClick}
      hasAlerts={hasAlerts}
      type="workflow"
    />
    {showDeprecated && (
      <Td className="medium">
        <Icon iconName={deprecated ? 'small-tick' : 'cross'} />
      </Td>
    )}
    <Td className="huge separated-cell">
      <InstancesBar
        states={states}
        instances={rest}
        totalInstances={rest.TOTAL}
        id={id}
        date={date}
      />
    </Td>
    <Td className="narrow">
      <Tooltip content={rest.TOTAL || 0} position={Position.TOP}>
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
        link={`/workflows?paneId=${id}&paneTab=order+stats`}
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
        link={`/workflows?paneId=${id}&paneTab=order+stats`}
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
  }),
  mapProps(
    ({ order_stats: orderStats, band, ...rest }: Props): Props => ({
      orderStats: orderStats && buildOrderStatsDisposition(orderStats, band),
      slaStats: orderStats && buildOrderStatsSLA(orderStats, band),
      ...rest,
    })
  ),
  mapProps(
    ({ orderStats, slaStats, ...rest }: Props): Props => ({
      totalOrderStats: orderStats
        ? orderStats.completed + orderStats.automatically + orderStats.manually
        : 0,
      totalSlaStats: slaStats ? slaStats['In SLA'] + slaStats['Out of SLA'] : 0,
      orderStats,
      slaStats,
      ...rest,
    })
  ),
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
  ])
)(TableRow);
