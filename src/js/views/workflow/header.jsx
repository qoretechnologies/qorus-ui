// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { Link } from 'react-router';
import { Callout, Intent } from '@blueprintjs/core';

import withBackHandler from '../../hocomponents/withBackHandler';
import WorkflowControls from '../workflows/controls';
import WorkflowAutostart from '../workflows/autostart';
import Badge from '../../components/badge';
import { Group } from '../../components/groups';
import Alert from '../../components/alert';
import Box from '../../components/box';
import { ORDER_STATES, ORDER_STATES_ARRAY } from '../../constants/orders';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';
import InstancesBar from '../../components/instances_bar/index';
import Toolbar from '../../components/toolbar/index';

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
  onBackClick,
  date,
  ...rest
}: Props): React.Element<any> => (
  <div>
    <Breadcrumbs>
      <Crumb link="/workflows"> Workflows </Crumb>
      <Crumb>{rest.normalizedName}</Crumb>
    </Breadcrumbs>
    <div className="pull-right">
      <WorkflowControls id={id} enabled={enabled} />{' '}
      <WorkflowAutostart
        id={id}
        autostart={autostart}
        execCount={execCount}
        withExec
      />
    </div>
    <Box top>
      <Toolbar mb>
        <InstancesBar
          states={ORDER_STATES}
          instances={rest}
          totalInstances={rest.TOTAL}
          wrapperWidth={400}
        />
      </Toolbar>

      <div className="status-row">
        {groups.map((g, k) => (
          <Group key={k} name={g.name} size={g.size} />
        ))}
      </div>
    </Box>

    {hasAlerts && (
      <Box noPadding>
        <Callout
          intent={Intent.DANGER}
          title="Workflow with errors"
          iconName="warning-sign"
        >
          This workflow has alerts raised against it that may prevent it from
          operating properly.{' '}
          <Link to={`/workflows?date=${date}&paneId=${id}`}>
            View alerts ({alerts.length}
            ).
          </Link>
        </Callout>
      </Box>
    )}
  </div>
);

export default compose(
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
