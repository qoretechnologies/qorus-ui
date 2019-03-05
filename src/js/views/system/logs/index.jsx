import React from 'react';
import compose from 'recompose/compose';

import LogContainer from '../../../containers/log';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import { SimpleTabs, SimpleTab } from '../../../components/SimpleTabs';
import Box from '../../../components/box';
import Headbar from '../../../components/Headbar';
import titleManager from '../../../hocomponents/TitleManager';
import withTabs from '../../../hocomponents/withTabs';
import Flex from '../../../components/Flex';

type Props = {
  tabQuery: string,
  location: Object,
};

const Log: Function = ({ tabQuery }: Props) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>Logs</Crumb>
        <CrumbTabs tabs={['System', 'Http', 'Audit', 'Alert', 'Monitor']} />
      </Breadcrumbs>
    </Headbar>
    <Box top fill>
      <SimpleTabs activeTab={tabQuery}>
        <SimpleTab name="system">
          <LogContainer resource="system" intfc="system" />
        </SimpleTab>
        <SimpleTab name="http">
          <LogContainer resource="http" />
        </SimpleTab>
        <SimpleTab name="audit">
          <LogContainer resource="audit" />
        </SimpleTab>
        <SimpleTab name="alert">
          <LogContainer resource="alert" />
        </SimpleTab>
        <SimpleTab name="monitor">
          <LogContainer resource="mon" />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </Flex>
);

export default compose(
  withTabs('system'),
  titleManager('Logs')
)(Log);
