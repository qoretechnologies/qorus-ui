// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { rebuildConfigHash } from '../../../helpers/interfaces';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import DetailTab from './detail';
import Box from '../../../components/box';
import Code from '../../../components/code';
import Loader from '../../../components/loader';
import ProcessTable from '../../../components/ProcessTable';
import LogContainer from '../../../containers/log';
import Mappers from '../../../containers/mappers';
import Valuemaps from '../../../containers/valuemaps';
import Releases from '../../../containers/releases';
import ConfigItemsTable from '../../../components/ConfigItemsTable';
import InfoTable from '../../../components/info_table';
import Instances from './list';

type JobsDetailTabsProps = {
  activeTab: string,
  model: Object,
  isTablet?: boolean,
  lib: Object,
  location: Object,
  date?: string,
  linkDate?: string,
  isPane?: boolean,
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
}: JobsDetailTabsProps): React.Element<any> => (
  <SimpleTabs activeTab={activeTab}>
    {isPane && (
      <SimpleTab name="detail">
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
        {model.code ? (
          <Code
            selected={{
              name: `code - ${lib.code[0].name}`,
              code: lib.code[0].body,
              item: {
                name: lib.code[0].name,
              },
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
        <LogContainer resource={`jobs/${model.id}`} location={location} />
      </Box>
    </SimpleTab>
    <SimpleTab name="mappers">
      <Box top fill noPadding>
        <Mappers mappers={model.mappers} />
      </Box>
    </SimpleTab>
    <SimpleTab name="value maps">
      <Box top fill noPadding>
        <Valuemaps vmaps={model.vmaps} />
      </Box>
    </SimpleTab>
    <SimpleTab name="releases">
      <Box top fill>
        <Releases
          component={model.name}
          compact
          key={model.name}
          location={location}
        />
      </Box>
    </SimpleTab>
    <SimpleTab name="config">
      <Box top fill scrollY>
        <ConfigItemsTable items={rebuildConfigHash(model)} intrf="jobs" />
      </Box>
    </SimpleTab>
    <SimpleTab name="info">
      <Box top fill>
        <InfoTable object={model} />
      </Box>
    </SimpleTab>
  </SimpleTabs>
);

export default compose(
  onlyUpdateForKeys(['model', 'activeTab', 'lib', 'isTablet'])
)(JobsDetailTabs);
