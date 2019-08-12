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
import ExpandableItem from '../../../components/ExpandableItem';

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
        <CrumbTabs
          tabs={[...logs.map(log => log.name || log.logger), 'Default Loggers']}
        />
      </Breadcrumbs>
    </Headbar>

    <SimpleTabs activeTab={tabQuery}>
      {logs.map(log => (
        <SimpleTab
          name={log.name ? log.name.toLowerCase() : log.logger.toLowerCase()}
        >
          <Box top fill scrollY>
            <LogContainer
              resource={log.uri_path}
              intfc="system"
              id={log.logger}
            />
          </Box>
        </SimpleTab>
      ))}
      <SimpleTab name="default loggers" show>
        <Box top fill scrollY>
          <ExpandableItem title="System default logger">
            {() => (
              <DefaultLogger name="Logger data" defaultOnly resource="system" />
            )}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Workflows default logger" show>
            {() => (
              <DefaultLogger
                name="Logger data"
                defaultOnly
                resource="workflows"
              />
            )}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Services default logger" show>
            {() => (
              <DefaultLogger
                name="Logger data"
                defaultOnly
                resource="services"
              />
            )}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Jobs default logger" show>
            {() => (
              <DefaultLogger name="Logger data" defaultOnly resource="jobs" />
            )}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Datasources default logger" show>
            {() => (
              <DefaultLogger
                name="Logger data"
                defaultOnly
                resource="remotes"
              />
            )}
          </ExpandableItem>
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
  withTabs('audit'),
  titleManager('Logs')
)(Log);
