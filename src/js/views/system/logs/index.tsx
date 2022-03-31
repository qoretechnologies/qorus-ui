import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import Box from '../../../components/box';
import { Breadcrumbs, Crumb, CrumbTabs } from '../../../components/breadcrumbs';
import ExpandableItem from '../../../components/ExpandableItem';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Loader from '../../../components/loader';
import { SimpleTab, SimpleTabs } from '../../../components/SimpleTabs';
import DefaultLogger from '../../../containers/DefaultLogger';
import LogContainer from '../../../containers/log';
import showIfPassed from '../../../hocomponents/show-if-passed';
import titleManager from '../../../hocomponents/TitleManager';
import withTabs from '../../../hocomponents/withTabs';
import actions from '../../../store/api/actions';

type Props = {
  tabQuery: string;
  location: any;
  logs: any;
};

const Log: Function = ({ tabQuery, logs }: Props) => (
  <Flex>
    <Headbar>
      <Breadcrumbs>
        <Crumb>Logs</Crumb>
        <CrumbTabs
          // @ts-ignore ts-migrate(2339) FIXME: Property 'map' does not exist on type 'Object'.
          tabs={[...logs.map((log) => log.name || log.logger), 'Default Loggers']}
        />
      </Breadcrumbs>
    </Headbar>

    <SimpleTabs activeTab={tabQuery}>
      {/* @ts-ignore ts-migrate(2339) FIXME: Property 'map' does not exist on type 'Object'. */}
      {logs.map((log) => (
        <SimpleTab name={log.name ? log.name.toLowerCase() : log.logger.toLowerCase()}>
          <Box top fill scrollY>
            <LogContainer resource={log.uri_path} intfc="system" id={log.logger} />
          </Box>
        </SimpleTab>
      ))}
      <SimpleTab name="default loggers" show>
        <Box top fill scrollY>
          <ExpandableItem title="System default logger">
            {() => <DefaultLogger name="Logger data" defaultOnly resource="system" />}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Workflows default logger" show>
            {() => <DefaultLogger name="Logger data" defaultOnly resource="workflows" />}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Services default logger" show>
            {() => <DefaultLogger name="Logger data" defaultOnly resource="services" />}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Jobs default logger" show>
            {() => <DefaultLogger name="Logger data" defaultOnly resource="jobs" />}
          </ExpandableItem>
          <br />
          <ExpandableItem title="Datasources default logger" show>
            {() => <DefaultLogger name="Logger data" defaultOnly resource="remotes" />}
          </ExpandableItem>
        </Box>
      </SimpleTab>
    </SimpleTabs>
  </Flex>
);

export default compose(
  connect(
    (state) => ({
      logs: state.api.system.data.loggerParams.configurable_systems,
      defaultLogger: state.api.system.data.defaultLoggers?.system,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
      fetchDefaultLogger: actions.system.fetchDefaultLogger,
    }
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchDefaultLogger('system');
    },
  }),
  showIfPassed(({ defaultLogger }) => defaultLogger, <Loader />),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3 arguments, but got 1.
  withTabs('audit'),
  titleManager('Logs')
)(Log);
