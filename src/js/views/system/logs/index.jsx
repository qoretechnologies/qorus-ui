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
import lifecycle from 'recompose/lifecycle';
import showIfPassed from '../../../hocomponents/show-if-passed';
import actions from '../../../store/api/actions';
import { connect } from 'react-redux';
import Loader from '../../../components/loader';

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
          <LogContainer resource="system" intfc="system" id="qorus-core" />
        </SimpleTab>
        <SimpleTab name="http">
          <LogContainer resource="http" intfc="system" id="http" />
        </SimpleTab>
        <SimpleTab name="audit">
          <LogContainer resource="audit" intfc="system" id="audit" />
        </SimpleTab>
        <SimpleTab name="alert">
          <LogContainer resource="alert" intfc="system" id="alert" />
        </SimpleTab>
        <SimpleTab name="monitor">
          <LogContainer resource="mon" intfc="system" id="monitoring" />
        </SimpleTab>
      </SimpleTabs>
    </Box>
  </Flex>
);

export default compose(
  connect(
    state => ({
      defaultLogger: state.api.system.data.defaultLoggers?.system,
    }),
    {
      fetchDefaultLogger: actions.system.fetchDefaultLogger,
    }
  ),
  lifecycle({
    componentWillMount () {
      this.props.fetchDefaultLogger('system');
    },
  }),
  showIfPassed(({ defaultLogger }) => defaultLogger, <Loader />),
  withTabs('system'),
  titleManager('Logs')
)(Log);
