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
import {
  rebuildConfigHash,
  objectCollectionToArray,
} from '../../../helpers/interfaces';
import List from './list';
import Performance from './performance';
import GlobalConfigItemsTable from '../../../components/GlobalConfigItemsTable';
import WorkflowConfigItemsTable from '../../../components/WorkflowConfigItemsTable';

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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'lib' does not exist on type 'WorkflowDet... Remove this comment to see the full error message
  lib,
  systemOptions,
  band,
  isPane,
  location,
  date,
  linkDate,
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          key={workflow.name}
          workflow={workflow}
          // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
          systemOptions={systemOptions}
          band={band}
        />
      </SimpleTab>
    )}
    <SimpleTab name="code">
      <Box top fill>
        <Code data={lib} location={location} />
      </Box>
    </SimpleTab>
    <SimpleTab name="steps">
      <Box top fill>
        { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
        <StepsTab workflow={workflow} />
      </Box>
    </SimpleTab>
    <SimpleTab name="log">
      <Box top fill>
        <LogContainer
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id={workflow.id}
          intfc="workflows"
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
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
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message */ }
        <MappersTable mappers={workflow.mappers} />
      </Box>
    </SimpleTab>
    <SimpleTab name="value maps">
      <Box top fill noPadding>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'. */ }
        <Valuemaps vmaps={workflow.vmaps} />
      </Box>
    </SimpleTab>
    <SimpleTab name="releases">
      <Box top fill>
        <Releases
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          component={workflow.name}
          compact
          location={location}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
        <GlobalConfigItemsTable
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'global_config' does not exist on type 'O... Remove this comment to see the full error message
          globalItems={workflow.global_config}
          intrf="system"
        />
        <WorkflowConfigItemsTable
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'config' does not exist on type 'Object'.
          globalItems={objectCollectionToArray(workflow.config)}
          intrf="workflows"
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          intrfId={workflow.id}
        />
        <ConfigItemsTable
          items={{
            ...rebuildConfigHash(workflow, true),
          }}
          intrf="workflows"
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          intrfId={workflow.id}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="order stats">
      <Box top fill scrollY>
        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message */ }
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
