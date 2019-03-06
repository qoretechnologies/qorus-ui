// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import Box from '../../../components/box';
import DetailTab from './detail';
import ResourceTab from './resources';
import MethodsTab from './methods';
import Code from '../../../components/code';
import MappersTable from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import LogContainer from '../../../containers/log';
import Releases from '../../../containers/releases';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import ConfigItemsTable from '../../../components/ConfigItemsTable';
import InfoTable from '../../../components/info_table';
import ProcessTable from '../../../components/ProcessTable';
import AuthLabels from '../../../containers/AuthLabels';

type ServiceTabsProps = {
  service: Object,
  codeData: Object,
  activeTab: string,
  location: Object,
  methods: Array<Object>,
  configItems: Object,
  systemOptions: Array<Object>,
  isPane?: boolean,
};

const ServiceTabs: Function = ({
  service,
  codeData,
  activeTab,
  location,
  methods,
  configItems,
  systemOptions,
  isPane,
}: ServiceTabsProps): React.Element<any> => (
  <SimpleTabs activeTab={activeTab}>
    {isPane && (
      <SimpleTab name="detail">
        <DetailTab
          key={service.name}
          service={service}
          systemOptions={systemOptions}
        />
      </SimpleTab>
    )}
    <SimpleTab name="methods">
      <MethodsTab service={service} methods={methods} />
    </SimpleTab>
    <SimpleTab name="code">
      <Box top fill>
        <Code data={codeData} location={location} />
      </Box>
    </SimpleTab>
    <SimpleTab name="log">
      <Box top fill>
        <LogContainer
          id={service.id}
          intfc="services"
          resource={`services/${service.id}`}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="mappers">
      <Box top fill noPadding>
        <MappersTable mappers={service.mappers} />
      </Box>
    </SimpleTab>
    <SimpleTab name="value maps">
      <Box top fill noPadding>
        <Valuemaps vmaps={service.vmaps} />
      </Box>
    </SimpleTab>
    <SimpleTab name="process">
      <Box top fill>
        <ProcessTable model={service} />
      </Box>
    </SimpleTab>
    <SimpleTab name="resources">
      <Box top fill>
        <ResourceTab
          resources={service.resources}
          resourceFiles={service.resource_files}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="auth labels">
      <Box top fill noPadding>
        <AuthLabels service={service} />
      </Box>
    </SimpleTab>
    <SimpleTab name="releases">
      <Box top fill>
        <Releases
          component={service.name}
          compact
          key={service.name}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="config">
      <Box top fill scrollY>
        <ConfigItemsTable
          items={configItems}
          globalItems={service.global_config}
          intrf="services"
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="info">
      <Box top fill>
        <InfoTable object={service} />
      </Box>
    </SimpleTab>
  </SimpleTabs>
);

export default compose(
  onlyUpdateForKeys(['service', 'methods', 'codeData', 'location', 'activeTab'])
)(ServiceTabs);
