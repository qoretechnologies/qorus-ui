// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import withBackHandler from '../../hocomponents/withBackHandler';
import actions from '../../store/api/actions';
import WorkflowControls from '../workflows/controls';
import AutoStart from '../../components/autostart';
import Badge from '../../components/badge';
import { Group } from '../../components/groups';
import Alert from '../../components/alert';
import Icon from '../../components/icon';
import { ORDER_STATES, ORDER_STATES_ARRAY } from '../../constants/orders';

type Props = {
  id: number,
  enabled: boolean,
  autostart: number,
  execCount: number,
  exec_count: number,
  name: string,
  version: string,
  groups: Array<Object>,
  has_alerts: boolean,
  alerts: Array<Object>,
  onBackClick: Function,
  setAutostart: Function,
  handleAutostartClick: Function,
  date: string,
};

const WorkflowHeader: Function = ({
  id,
  enabled,
  autostart,
  exec_count: execCount,
  name,
  version,
  groups,
  has_alerts: hasAlerts,
  alerts,
  handleAutostartClick,
  onBackClick,
  date,
  ...rest
}: Props): React.Element<any> => (
  <div className="workflow-header">
    <div className="row">
      <div className="col-xs-12">
        <h3 className="detail-title pull-left">
          <a href="#" onClick={onBackClick}>
            <Icon icon="angle-left" />
          </a>
          {' '}
          {name}
          {' '}
          <small>{version}</small>
          {' '}
          <small>({id})</small>
        </h3>
        <div className="pull-right">
          <WorkflowControls
            id={id}
            enabled={enabled}
          />
          <AutoStart
            autostart={autostart}
            execCount={execCount}
            onIncrementClick={handleAutostartClick}
            onDecrementClick={handleAutostartClick}
          />
        </div>
      </div>
    </div>
    <div className="row status-row">
      <div className="col-xs-12 states">
        {ORDER_STATES.map((o, k) => (
          rest[o.name] > 0 ?
            <Badge
              key={k}
              className={`status-${o.label}`}
              val={`${o.short}: ${rest[o.name]}`}
            /> :
            undefined
        ))}
      </div>
    </div>
    <div className="row status-row">
      <div className="col-xs-12 groups">
        {groups.map((g, k) => (
          <Group
            key={k}
            name={g.name}
            size={g.size}
          />
        ))}
      </div>
    </div>
    { hasAlerts && (
      <Alert bsStyle="danger">
        <i className="fa fa-warning" />
        <strong> Warning: </strong> this workflow has alerts raised against it
        that may prevent it from operating properly.
        {' '}
        <Link to={`/workflows?date=${date}&paneId=${id}`}>
          View alerts ({alerts.length}).
        </Link>
      </Alert>
    )}
  </div>
);

export default compose(
  connect(
    () => ({}),
    {
      setAutostart: actions.workflows.setAutostart,
    }
  ),
  withHandlers({
    handleAutostartClick: ({ setAutostart, id }: Props): Function => (value: number): void => {
      setAutostart(id, value);
    },
  }),
  withBackHandler(),
  pure([
    ...ORDER_STATES_ARRAY,
    'alerts',
    'has_alerts',
    'enabled',
    'autostart',
    'exec_count',
    '_updated',
  ])
)(WorkflowHeader);
