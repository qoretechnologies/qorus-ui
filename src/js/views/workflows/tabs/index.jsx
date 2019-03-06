// @flow
import React from 'react';

import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import DetailTab from './detail';
import Code from '../../../components/code';
import StepsTab from '../../../components/StepCodeDiagram';
import LogContainer from '../../../containers/log';
import ErrorsTab from './errors';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import Releases from '../../../containers/releases';
import InfoTable from '../../../components/info_table/index';
import Box from '../../../components/box';
import OrderStats from '../../../components/OrderStats';
import ConfigItemsTable from '../../../components/ConfigItemsTable';
import ProcessTable from '../../../components/ProcessTable';
import { ORDER_STATES } from '../../../constants/orders';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import List from './list';
import Performance from './performance';

type WorkflowDetailTabsProps = {
  workflow: Object,
  activeTab: string,
  systemOptions?: Object,
  band?: string,
  isPane: boolean,
  location: Object,
  date?: string,
  linkDate?: string,
};

const WorkflowDetailTabs: Function = ({
  workflow,
  activeTab,
  systemOptions,
  band,
  isPane,
  location,
  date,
  linkDate,
}: WorkflowDetailTabsProps): React.Element<any> => (
  <SimpleTabs activeTab={activeTab}>
    {!isPane && (
      <SimpleTab name="orders">
        <List {...{ workflow, date, location, linkDate }} />
      </SimpleTab>
    )}
    {!isPane && (
      <SimpleTab name="performance">
        <Performance {...{ workflow, date, location, linkDate }} />
      </SimpleTab>
    )}
    {isPane && (
      <SimpleTab name="detail">
        <DetailTab
          key={workflow.name}
          workflow={workflow}
          systemOptions={systemOptions}
          band={band}
        />
      </SimpleTab>
    )}
    <SimpleTab name="code">
      <Box top fill>
        <Code data={workflow.lib} location={location} />
      </Box>
    </SimpleTab>
    <SimpleTab name="steps">
      <Box top fill>
        <StepsTab workflow={workflow} />
      </Box>
    </SimpleTab>
    <SimpleTab name="log">
      <Box top fill>
        <LogContainer
          id={workflow.id}
          intfc="workflows"
          resource={`workflows/${workflow.id}`}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="errors">
      <Box top fill>
        <ErrorsTab location={location} workflow={workflow} />
      </Box>
    </SimpleTab>
    <SimpleTab name="mappers">
      <Box top fill noPadding>
        <MappersTable mappers={workflow.mappers} />
      </Box>
    </SimpleTab>
    <SimpleTab name="value maps">
      <Box top fill noPadding>
        <Valuemaps vmaps={workflow.vmaps} />
      </Box>
    </SimpleTab>
    <SimpleTab name="releases">
      <Box top fill>
        <Releases
          component={workflow.name}
          compact
          location={location}
          key={workflow.name}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="process">
      <Box top fill>
        <ProcessTable model={workflow} />
      </Box>
    </SimpleTab>
    <SimpleTab name="config">
      <Box top fill scrollY>
        <ConfigItemsTable
          items={rebuildConfigHash(workflow, true)}
          globalItems={workflow.global_config}
          intrf="workflows"
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="order stats">
      <Box top fill scrollY>
        <OrderStats renderRows orderStats={workflow.order_stats} />
      </Box>
    </SimpleTab>
    <SimpleTab name="info">
      <Box top fill>
        <InfoTable
          object={workflow}
          omit={[
            'options',
            'lib',
            'stepmap',
            'segment',
            'steps',
            'stepseg',
            'stepinfo',
            'wffuncs',
            'groups',
            'alerts',
            'exec_count',
            'autostart',
            'has_alerts',
            'TOTAL',
            'timestamp',
            'id',
            'normalizedName',
          ].concat(ORDER_STATES.map(os => os.name))}
        />
      </Box>
    </SimpleTab>
  </SimpleTabs>
);

export default WorkflowDetailTabs;
