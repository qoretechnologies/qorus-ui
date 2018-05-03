/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';
import classNames from 'classnames';

import { Tr, Td } from '../../components/new_table';
import Checkbox from '../../components/checkbox';
import WorkflowControls from './controls';
import { Controls, Control as Button } from '../../components/controls';
import Badge from '../../components/badge';
import Icon from '../../components/icon';
import DetailButton from '../../components/detail_button';
import AutoStart from './autostart';
import { ORDER_STATES_ARRAY } from '../../constants/orders';
import { formatCount } from '../../helpers/orders';

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
  isTablet: boolean,
}

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
  ...rest,
}: Props): React.Element<any> => (
  <Tr
    className={classNames({
      info: isActive,
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
      <DetailButton
        onClick={handleDetailClick}
        active={isActive}
      />
    </Td>
    {!isTablet && (
      <Td key="controls" className="narrow">
        <WorkflowControls
          id={id}
          enabled={enabled}
        />
      </Td>
    )}
    <Td
      key="autostart"
      name="autostart"
      className="medium"
    >
      <AutoStart
        id={id}
        autostart={autostart}
        execCount={execs}
      />
    </Td>
    <Td className="tiny">
      { hasAlerts && (
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
    <Td className="narrow">{ execs }</Td>
    <Td className="narrow">{ id }</Td>
    <Td className="name">
      <Link
        className="resource-name-link"
        to={`/workflow/${id}?date=${date}`}
        title={name}
      >
        { name }
      </Link>
    </Td>
    <Td className="normal text">{ version }</Td>
    {states.map((state: Object, index: number): React.Element<Td> => {
      const title = !expanded ? rest[`GROUPED_${state.name}_STATES`]: state.title;
      const value = !expanded ? rest[`GROUPED_${state.name}`] : rest[state.name];

      return (
        <Td key={`wf_state_${index}`} className={expanded || isTablet ? 'narrow' : 'medium'}>
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
        </Td>
      );
    })}
    <Td className="narrow">
      <Link to={`/workflow/${id}?date=${date}`}>
        { formatCount(rest.TOTAL) || 0 }
      </Link>
    </Td>
    { showDeprecated && (
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
