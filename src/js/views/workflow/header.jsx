// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import size from 'lodash/size';

import WorkflowControls from '../workflows/controls';
import WorkflowAutostart from '../workflows/autostart';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../components/breadcrumbs';
import Pull from '../../components/Pull';
import Headbar from '../../components/Headbar';
import Search from '../../containers/search';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../components/controls';
import withHandlers from 'recompose/withHandlers';

type Props = {
  id: number,
  enabled: boolean,
  remote: boolean,
  autostart: number,
  execCount: number,
  exec_count: number,
  name: string,
  version: string,
  has_alerts: boolean,
  alerts: Array<Object>,
  setAutostart: Function,
  date: string,
  normalizedName: string,
  onSearch: Function,
  handleAlertClick: Function,
  searchQuery?: string,
  tab: string,
};

const WorkflowHeader: Function = ({
  id,
  enabled,
  autostart,
  exec_count: execCount,
  has_alerts: hasAlerts,
  alerts,
  remote,
  onSearch,
  searchQuery,
  tab,
  handleAlertClick,
  normalizedName,
  mappers,
}: Props): React.Element<any> => (
  <Headbar>
    <Breadcrumbs>
      <Crumb link="/workflows"> Workflows </Crumb>
      <Crumb>{normalizedName}</Crumb>
      <CrumbTabs
        tabs={[
          'Orders',
          'Performance',
          { title: 'Mappers', suffix: `(${size(mappers)})` },
          'Code',
          'Log',
          'Info',
        ]}
      />
    </Breadcrumbs>
    <Pull right>
      {hasAlerts && (
        <ButtonGroup>
          <Button
            big
            iconName="error"
            btnStyle="danger"
            onClick={handleAlertClick}
            title="This workflow has alerts raised against it which may prevent it from working properly"
          >
            {alerts.length}
          </Button>
        </ButtonGroup>
      )}
      <WorkflowControls big id={id} enabled={enabled} remote={remote} />
      <WorkflowAutostart
        big
        id={id}
        autostart={autostart}
        execCount={execCount}
        withExec
      />
      {tab === 'orders' && (
        <Search
          defaultValue={searchQuery}
          onSearchUpdate={onSearch}
          resource="workflow"
        />
      )}
    </Pull>
  </Headbar>
);

export default compose(
  withRouter,
  withHandlers({
    handleAlertClick: ({ router, date, id }): Function => (): void => {
      router.push(`/workflows?date=${date}&paneTab=detail&paneId=${id}`);
    },
  }),
  pure([
    'alerts',
    'has_alerts',
    'enabled',
    'autostart',
    'exec_count',
    '_updated',
    'location',
    'tab',
  ])
)(WorkflowHeader);
