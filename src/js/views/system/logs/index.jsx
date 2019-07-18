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
  logs: Object,
};

const Log: Function = ({ tabQuery, logs }: Props) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>Logs</Crumb>
        <CrumbTabs tabs={[...logs.map(log => log.logger), 'Default Loggers']} />
      </Breadcrumbs>
    </Headbar>

    <SimpleTabs activeTab={tabQuery}>
      {logs.map(log => (
        <SimpleTab name={log.logger.toLowerCase()}>
          <Box top fill scrollY>
            <LogContainer
              resource={log.uri_path}
              intfc="system"
              id={log.logger}
            />
          </Box>
        </SimpleTab>
      ))}
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
          <DefaultLogger
            name="Datasources default logger"
            defaultOnly
            resource="remotes"
          />
        </Box>
      </SimpleTab>
    </SimpleTabs>
  </Flex>
);

export default compose(
  connect(
    state => ({
      logs: state.api.system.data.loggerParams.configurable_systems,
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
