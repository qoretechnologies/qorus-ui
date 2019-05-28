// @flow
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import size from 'lodash/size';

import WorkflowControls from '../controls';
import WorkflowAutostart from '../autostart';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import Pull from '../../../components/Pull';
import Headbar from '../../../components/Headbar';
import Search from '../../../containers/search';
import {
  Controls as ButtonGroup,
  Control as Button,
} from '../../../components/controls';
import withHandlers from 'recompose/withHandlers';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { countArrayItemsInObject, countConfigItems } from '../../../utils';
import showIfPassed from '../../../hocomponents/show-if-passed';

type Props = {
  setAutostart: Function,
  date: string,
  onSearch: Function,
  handleAlertClick: Function,
  searchQuery?: string,
  tab: string,
  workflow: Object,
};

const WorkflowHeader: Function = ({
  workflow,
  onSearch,
  searchQuery,
  tab,
  handleAlertClick,
}: Props): React.Element<any> => (
  <Headbar>
    <Breadcrumbs>
      <Crumb link="/workflows"> Workflows </Crumb>
      <Crumb>{workflow.normalizedName}</Crumb>
      <CrumbTabs
        tabs={[
          'Orders',
          'Performance',
          'Steps',
          'Order Stats',
          'Process',
          {
            title: 'Config',
            suffix: `(${countConfigItems({
              ...rebuildConfigHash(workflow, true),
            })})`,
          },
          'Releases',
          {
            title: 'Value maps',
            suffix: `(${size(workflow.vmaps)})`,
          },
          {
            title: 'Mappers',
            suffix: `(${size(workflow.mappers)})`,
          },
          'Errors',
          'Code',
          'Log',
          'Info',
        ]}
      />
    </Breadcrumbs>
    <Pull right>
      {workflow.hasAlerts && (
        <ButtonGroup>
          <Button
            big
            iconName="error"
            btnStyle="danger"
            onClick={handleAlertClick}
            title="This workflow has alerts raised against it which may prevent it from working properly"
          >
            {workflow.alerts.length}
          </Button>
        </ButtonGroup>
      )}
      <WorkflowControls
        big
        id={workflow.id}
        enabled={workflow.enabled}
        remote={workflow.remote}
      />
      <WorkflowAutostart
        big
        id={workflow.id}
        autostart={workflow.autostart}
        execCount={workflow.exec_count}
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
  showIfPassed(({ workflow }) => workflow),
  withRouter,
  withHandlers({
    handleAlertClick: ({ router, date, workflow }): Function => (): void => {
      router.push(
        `/workflows?date=${date}&paneTab=detail&paneId=${workflow.id}`
      );
    },
  }),
  pure(['workflow', '_updated', 'location', 'tab'])
)(WorkflowHeader);
