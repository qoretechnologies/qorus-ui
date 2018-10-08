/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';
import classNames from 'classnames';
import {
  Tooltip,
  Position,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';

import { Tr, Td } from '../../components/new_table';
import Box from '../../components/box';
import PaneItem from '../../components/pane_item';
import Checkbox from '../../components/checkbox';
import WorkflowControls from './controls';
import { Controls, Control as Button } from '../../components/controls';
import Icon from '../../components/icon';
import DetailButton from '../../components/detail_button';
import AutoStart from './autostart';
import { ORDER_STATES_ARRAY } from '../../constants/orders';
import InstancesBar from '../../components/instances_bar';
import InstancesChart from '../../components/instances_chart';
import ProcessSummary from '../../components/ProcessSummary';
import mapProps from 'recompose/mapProps';

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
  handleWarningClick: Function,
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
  handleRemoteClick: Function,
  remote: boolean,
  setRemote: Function,
  order_stats?: Object,
  orderStats?: Object,
  slaStats?: Object,
  totalOrderStats: number,
  totalSlaStats: number,
};

const TableRow: Function = ({
  isActive,
  date,
  handleCheckboxClick,
  handleDetailClick,
  handleHighlightEnd,
  handleWarningClick,
  id,
  _selected,
  _updated,
  enabled,
  autostart,
  exec_count: execs,
  has_alerts: hasAlerts,
  name,
  version,
  states,
  deprecated,
  showDeprecated,
  isTablet,
  first,
  handleRemoteClick,
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
      'row-active': isActive,
      'row-alert': hasAlerts,
      'row-selected': _selected,
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
    <Td key="detail" className="narrow">
      <DetailButton onClick={handleDetailClick} active={isActive} />
    </Td>
    {!isTablet && (
      <Td key="controls" className="narrow">
        <WorkflowControls id={id} enabled={enabled} />
      </Td>
    )}
    <Td key="autostart" name="autostart" className="medium">
      <AutoStart id={id} autostart={autostart} execCount={execs} />
    </Td>
    <Td className="tiny">
      {hasAlerts && (
        <Controls>
          <Button
            iconName="warning-sign"
            btnStyle="danger"
            onClick={handleWarningClick}
            title="Show alerts"
          />
        </Controls>
      )}
    </Td>
    <Td className="narrow">{execs}</Td>
    <Td className="narrow">{id}</Td>
    <Td className="name">
      <Popover
        hoverOpenDelay={300}
        content={
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
        interactionKind={PopoverInteractionKind.HOVER}
        position={Position.TOP}
        rootElementTag="div"
        className="block"
        useSmartPositioning
      >
        <Link
          className="resource-name-link"
          to={`/workflow/${id}?date=${date}`}
        >
          {name}
        </Link>
      </Popover>
    </Td>
    <Td className="normal text">{version}</Td>
    <Td className="huge">
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
    <Td className="big">
      <InstancesBar
        states={[
          { name: 'completed', label: 'complete' },
          { name: 'automatically', label: 'automatic' },
          { name: 'manually', label: 'error' },
        ]}
        instances={orderStats}
        totalInstances={totalOrderStats}
        workflowId={id}
        date={date}
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
        date={date}
        link={`/workflows?paneId=${id}&paneTab=order+stats`}
      />
    </Td>
    <Td className="narrow">
      <Controls>
        <Button
          icon={remote ? 'small-tick' : 'cross'}
          btnStyle={remote ? 'info' : 'default'}
          onClick={handleRemoteClick}
        />
      </Controls>
    </Td>
    {showDeprecated && (
      <Td className="medium">
        <Icon iconName={deprecated ? 'flag' : 'flag-o'} />
      </Td>
    )}
  </Tr>
);

export default compose(
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
    handleWarningClick: ({ openPane, id }: Props): Function => (): void => {
      openPane(id, 'detail');
    },
    handleRemoteClick: ({
      setRemote,
      id,
      remote,
    }: Props): Function => (): void => {
      setRemote(id, !remote);
    },
  }),
  mapProps(
    ({ order_stats, ...rest }: Props): Props => ({
      orderStats: order_stats && {
        completed: order_stats
          .find(stat => stat.label === '24_hour_band')
          .l.find(disp => disp.disposition === 'C').count,
        automatically: order_stats
          .find(stat => stat.label === '24_hour_band')
          .l.find(disp => disp.disposition === 'A').count,
        manually: order_stats
          .find(stat => stat.label === '24_hour_band')
          .l.find(disp => disp.disposition === 'M').count,
      },
      slaStats: order_stats && {
        ['In SLA']: order_stats
          .find(stat => stat.label === '24_hour_band')
          .sla.find(sla => sla.in_sla).count,
        ['Out of SLA']: order_stats
          .find(stat => stat.label === '24_hour_band')
          .sla.find(sla => sla.in_sla === false).count,
      },
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
    ...ORDER_STATES_ARRAY,
  ])
)(TableRow);
