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
import DefaultLogger from '../../../containers/DefaultLogger';

type Props = {
  tabQuery: string,
  location: Object,
};

const Log: Function = ({ tabQuery }: Props) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>Logs</Crumb>
        <CrumbTabs
          tabs={[
            'System',
            'Http',
            'Audit',
            'Alert',
            'Monitor',
            'Default Loggers',
          ]}
        />
      </Breadcrumbs>
    </Headbar>

    <SimpleTabs activeTab={tabQuery}>
      <SimpleTab name="system">
        <Box top fill scrollY>
          <LogContainer resource="system" intfc="system" id="qorus-core" />
        </Box>
      </SimpleTab>
      <SimpleTab name="http">
        <Box top fill scrollY>
          <LogContainer resource="http" intfc="system" id="http" />
        </Box>
      </SimpleTab>
      <SimpleTab name="audit">
        <Box top fill scrollY>
          <LogContainer resource="audit" intfc="system" id="audit" />
        </Box>
      </SimpleTab>
      <SimpleTab name="alert">
        <Box top fill scrollY>
          <LogContainer resource="alert" intfc="system" id="alert" />
        </Box>
      </SimpleTab>
      <SimpleTab name="monitor">
        <Box top fill scrollY>
          <LogContainer resource="mon" intfc="system" id="monitoring" />
        </Box>
      </SimpleTab>
      <SimpleTab name="default loggers">
        <Box top fill scrollY>
          <DefaultLogger
            name="System default logger"
            defaultOnly
            resource="system"
          />
          <DefaultLogger
            name="Workflows default logger"
            defaultOnly
            resource="workflows"
          />
          <DefaultLogger
            name="Services default logger"
            defaultOnly
            resource="services"
          />
          <DefaultLogger
            name="Jobs default logger"
            defaultOnly
            resource="jobs"
          />
        </Box>
      </SimpleTab>
    </SimpleTabs>
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
