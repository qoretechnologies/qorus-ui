// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Box from '../../../components/box';
import Code from '../../../components/code';
import ConfigItemsTable from '../../../components/ConfigItemsTable';
import GlobalConfigItemsTable from '../../../components/GlobalConfigItemsTable';
import InfoTable from '../../../components/info_table';
import Loader from '../../../components/loader';
import ProcessTable from '../../../components/ProcessTable';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import LogContainer from '../../../containers/log';
import Mappers from '../../../containers/mappers';
import Releases from '../../../containers/releases';
import Valuemaps from '../../../containers/valuemaps';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import DetailTab from './detail';
import Instances from './list';

type JobsDetailTabsProps = {
  activeTab: string;
  model: any;
  isTablet?: boolean;
  lib: any;
  location: any;
  date?: string;
  linkDate?: string;
  isPane?: boolean;
};

const JobsDetailTabs: Function = ({
  activeTab,
  model,
  isTablet,
  lib,
  location,
  date,
  linkDate,
  isPane,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
JobsDetailTabsProps) => (
  <SimpleTabs activeTab={activeTab}>
    {isPane && (
      <SimpleTab name="detail">
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */}
        <DetailTab key={model.name} model={model} isTablet={isTablet} />
      </SimpleTab>
    )}
    {!isPane && (
      <SimpleTab name="instances">
        <Instances {...{ job: model, date, location, linkDate }} />
      </SimpleTab>
    )}
    <SimpleTab name="code">
      <Box top fill>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'. */}
        {model.code ? (
          <Code
            selected={{
              // @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
              name: lib.code[0].name,
              // @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
              code: lib.code[0].body,
              item: {
                // @ts-ignore ts-migrate(2339) FIXME: Property 'code' does not exist on type 'Object'.
                name: lib.code[0].name,
              },
              type: 'code',
            }}
            data={lib || {}}
            location={location}
          />
        ) : (
          <Loader />
        )}
      </Box>
    </SimpleTab>
    <SimpleTab name="process">
      <Box top fill>
        <ProcessTable model={model} />
      </Box>
    </SimpleTab>
    <SimpleTab name="log">
      <Box top fill>
        <LogContainer
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          id={model.id}
          intfc="jobs"
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          resource={`jobs/${model.id}`}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="mappers">
      <Box top fill noPadding>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'mappers' does not exist on type 'Object'... Remove this comment to see the full error message */}
        <Mappers mappers={model.mappers} />
      </Box>
    </SimpleTab>
    <SimpleTab name="value maps">
      <Box top fill noPadding>
        {/* @ts-ignore ts-migrate(2339) FIXME: Property 'vmaps' does not exist on type 'Object'. */}
        <Valuemaps vmaps={model.vmaps} />
      </Box>
    </SimpleTab>
    <SimpleTab name="releases">
      <Box top fill>
        <Releases
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          component={model.name}
          compact
          // @ts-ignore ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
          key={model.name}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="config">
      <Box top fill scrollY>
        <GlobalConfigItemsTable
          // @ts-ignore ts-migrate(2339) FIXME: Property 'global_config' does not exist on type 'O... Remove this comment to see the full error message
          globalItems={model.global_config}
          intrf="system"
        />
        <ConfigItemsTable
          items={rebuildConfigHash(model)}
          intrf="jobs"
          // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
          intrfId={model.id}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="info">
      <Box top fill>
        <InfoTable object={model} />
      </Box>
    </SimpleTab>
  </SimpleTabs>
);

export default compose(onlyUpdateForKeys(['model', 'activeTab', 'lib', 'isTablet']))(
  JobsDetailTabs
);
