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
import Checkbox from '../../components/checkbox';
import WorkflowControls from './controls';
import { Controls, Control as Button } from '../../components/controls';
import Badge from '../../components/badge';
import Icon from '../../components/icon';
import DetailButton from '../../components/detail_button';
import AutoStart from './autostart';
import { ORDER_STATES_ARRAY, ORDER_STATES } from '../../constants/orders';
import { formatCount } from '../../helpers/orders';
import Author from '../../components/author';
import { Groups, Group } from '../../components/groups';

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
  expanded,
  deprecated,
  showDeprecated,
  isTablet,
  first,
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
            icon="warning"
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
          <div style={{ padding: '10px' }}>
            <span>
              <strong>{rest.normalizedName}</strong>{' '}
            </span>
            <p>
              <small>
                <em>{rest.description}</em>
              </small>
            </p>
            <Author small model={rest} />
            <p>
              <strong>Instances</strong>
            </p>
            {ORDER_STATES.map((o, k) => (
              <Badge
                key={k}
                className={`status-${o.label}`}
                val={`${o.short}: ${rest[o.name]}`}
              />
            ))}
            <Groups small>
              {(rest.groups || []).map(g => (
                <Group
                  key={g.name}
                  name={g.name}
                  url={`/groups?group=${g.name}`}
                  size={g.size}
                  disabled={!g.enabled}
                />
              ))}
            </Groups>
            {rest.process && (
              <div>
                <h4>Process summary</h4>
                Node: <Badge val={rest.process.node} bypass label="info" />{' '}
                <Icon icon="circle" className="separator" /> PID:{' '}
                <Badge val={rest.process.pid} bypass label="info" />{' '}
                <Icon icon="circle" className="separator" /> Status:{' '}
                <Badge val={rest.process.status} bypass label="info" />{' '}
                <Icon icon="circle" className="separator" /> Memory:{' '}
                <Badge val={rest.process.priv_str} bypass label="info" />
              </div>
            )}
          </div>
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
    {states.map(
      (state: Object, index: number): React.Element<Td> => {
        const title = !expanded
          ? rest[`GROUPED_${state.name}_STATES`]
          : state.title;
        const value = !expanded
          ? rest[`GROUPED_${state.name}`]
          : rest[state.name];

        return (
          <Td
            key={`wf_state_${index}`}
            className={expanded || isTablet ? 'narrow' : 'medium'}
          >
            <Tooltip content={value} position={Position.TOP}>
              <Link
                className="workflow-status-link"
                to={`/workflow/${id}?filter=${title}&date=${date}`}
              >
                <Badge
                  className={`status-${state.label}`}
                  val={formatCount(value)}
                  title={value}
                />
              </Link>
            </Tooltip>
          </Td>
        );
      }
    )}
    <Td className="narrow">
      <Tooltip content={formatCount(rest.TOTAL) || 0} position={Position.TOP}>
        <Link to={`/workflow/${id}?date=${date}`}>
          {formatCount(rest.TOTAL) || 0}
        </Link>
      </Tooltip>
    </Td>
    {showDeprecated && (
      <Td className="medium">
        <Icon icon={deprecated ? 'flag' : 'flag-o'} />
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
  }),
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
    ...ORDER_STATES_ARRAY,
  ])
)(TableRow);
