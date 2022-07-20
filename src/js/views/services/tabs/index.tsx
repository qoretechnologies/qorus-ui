// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import Code from '../../../components/code';
import ConfigItemsTable from '../../../components/ConfigItemsTable';
import GlobalConfigItemsTable from '../../../components/GlobalConfigItemsTable';
import InfoTable from '../../../components/info_table';
import ProcessTable from '../../../components/ProcessTable';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import AuthLabels from '../../../containers/AuthLabels';
import LogContainer from '../../../containers/log';
import MappersTable from '../../../containers/mappers';
import Releases from '../../../containers/releases';
import Valuemaps from '../../../containers/valuemaps';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import DetailTab from './detail';
import MethodsTab from './methods';
import ResourceTab from './resources';

type ServiceTabsProps = {
  service: any;
  codeData: any;
  activeTab: string;
  location: any;
  methods: Array<Object>;
  configItems: any;
  systemOptions: Array<Object>;
  isPane?: boolean;
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
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
ServiceTabsProps) => (
  <SimpleTabs activeTab={activeTab}>
    {isPane && (
      <SimpleTab name="detail">
        {/* @ts-ignore ts-migrate(2769) FIXME: No overload matches this call. */}
        <DetailTab
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
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
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id={service.id}
          intfc="services"
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          resource={`services/${service.id}`}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="mappers">
      <Box top fill noPadding>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message */}
        <MappersTable mappers={service.mappers} />
      </Box>
    </SimpleTab>
    <SimpleTab name="value maps">
      <Box top fill noPadding>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'. */}
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
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id={service.id}
          // @ts-ignore ts-migrate(2339) FIXME: Property 'resources' does not exist on type 'Objec... Remove this comment to see the full error message
          resources={service.resources}
          // @ts-ignore ts-migrate(2339) FIXME: Property 'resource_files' does not exist on type '... Remove this comment to see the full error message
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
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          component={service.name}
          compact
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          key={service.name}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="config">
      <Box top fill scrollY>
        <GlobalConfigItemsTable
          // @ts-ignore ts-migrate(2339) FIXME: Property 'global_config' does not exist on type 'O... Remove this comment to see the full error message
          globalItems={service.global_config}
          intrf="system"
        />
        <ConfigItemsTable
          items={rebuildConfigHash(service)}
          intrf="services"
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          intrfId={service.id}
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
