/* @flow */
import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import pure from 'recompose/onlyUpdateForKeys';
import { Link } from 'react-router';

import { Tr, Td } from '../../components/new_table';
import Checkbox from '../../components/checkbox';
import WorkflowControls from './controls';
import { Controls, Control as Button } from '../../components/controls';
import Badge from '../../components/badge';
import Icon from '../../components/icon';
import AutoStart from '../../components/autostart';

type Props = {
  isActive?: boolean,
  date: string,
  openPane: Function,
  select: Function,
  handleCheckboxClick: Function,
  handleHighlightEnd: Function,
  handleDetailClick: Function,
  handleAutostartChange: Function,
  handleWarningClick: Function,
  updateDone: Function,
  setAutostart: Function,
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
}

const TableRow: Function = ({
  isActive,
  date,
  handleCheckboxClick,
  handleDetailClick,
  handleHighlightEnd,
  handleAutostartChange,
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
  ...rest
}: Props): React.Element<any> => (
  <Tr
    className={isActive ? 'info' : ''}
    onHighlightEnd={handleHighlightEnd}
    highlight={_updated}
  >
    <Td key="checkbox" className="narrow checker">
      <Checkbox
        action={handleCheckboxClick}
        checked={_selected ? 'CHECKED' : 'UNCHECKED'}
      />
    </Td>
    <Td key="detail" className="narrow">
      <Button
        label="Detail"
        btnStyle="success"
        onClick={handleDetailClick}
        title="Open detail pane"
      />
    </Td>
    <Td key="controls" className="narrow">
      <WorkflowControls
        id={id}
        enabled={enabled}
      />
    </Td>
    <Td
      key="autostart"
      name="autostart"
      className="narrow"
    >
      <AutoStart
        autostart={autostart}
        execCount={execs}
        onIncrementClick={handleAutostartChange}
        onDecrementClick={handleAutostartChange}
      />
    </Td>
    <Td className="narrow">
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
        to={`/workflow/${id}/list/All/${date}`}
      >
        { name }
      </Link>
    </Td>
    <Td className="narrow">{ version }</Td>
      {states.map((state: Object, index: number): React.Element<Td> => {
        const title = !expanded ? rest[`GROUPED_${state.name}_STATES`]: state.title;
        const value = !expanded ? rest[`GROUPED_${state.name}`] : rest[state.name];

        return (
          <Td key={`wf_state_${index}`} className="narrow">
            <Link
              className="workflow-status-link"
              to={`/workflow/${id}/list/${title}/${date}`}
            >
              <Badge
                className={`status-${state.label}`}
                val={value}
              />
            </Link>
          </Td>
        );
      })}
    <Td className="narrow">
      <Link to={`/workflow/${id}/list/All/${date}`}>
        { rest.TOTAL }
      </Link>
    </Td>
    { showDeprecated && (
      <Td className="narrow">
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
    handleDetailClick: ({ openPane, id }: Props): Function => (): void => {
      openPane(id);
    },
    handleAutostartChange: ({ setAutostart, id }: Props): Function => (value: number): void => {
      setAutostart(id, value);
    },
    handleWarningClick: ({ openPane, id }: Props): Function => (): void => {
      openPane(id, 'alerts');
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
  ])
)(TableRow);
