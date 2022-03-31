import React, { Component } from 'react';

import round from 'lodash/round';
import {
  FormattedMessage,
  injectIntl
} from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { createSelector } from 'reselect';

import {
  Breadcrumbs,
  Crumb
} from '../../../components/breadcrumbs';
import ChartComponent from '../../../components/chart';
import {
  Control as Button,
  Controls as ButtonGroup
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
} from '../../../components/controls';
import DashboardModule from '../../../components/dashboard_module/index';
import Flex from '../../../components/Flex';
import Headbar from '../../../components/Headbar';
import Loader from '../../../components/loader';
import {
  MasonryLayout,
  MasonryPanel
} from '../../../components/MasonryLayout';
import MultiDispositionChart from '../../../components/MultiDispositionChart';
import PaneItem from '../../../components/pane_item';
import Pull from '../../../components/Pull';
import { COLORS } from '../../../constants/ui';
import {
  formatChartTime,
  prepareHistory
} from '../../../helpers/chart';
import {
  calculateMemory,
  getSlicedRemotes,
  statusHealth
} from '../../../helpers/system';
import withModal from '../../../hocomponents/modal';
import titleManager from '../../../hocomponents/TitleManager';
import actions from '../../../store/api/actions';
import Nodes from './dropdowns/Nodes';
import GlobalModal from './modals/global';
import SLAModal from './modals/sla';

const viewSelector = createSelector(
  [
    (state) => state.api.health,
    (state) => state.api.system,
    (state) => state.ui,
    (state) => state.api.currentUser,
  ],
  (health, system, ui, currentUser) => ({
    health,
    system: system.data,
    isTablet: ui.settings.tablet,
    currentUser,
  })
);

type Props = {
  children: any,
  route?: Object,
  health: Object,
  dispatch: Function,
  location: Object,
  system: Object,
  isTablet: boolean,
  currentUser: Object,
  openModal: Function,
  closeModal: Function,
};

@connect(viewSelector)
@withModal()
@titleManager('Dashboard')
@injectIntl
export default class Dashboard extends Component {
  props: Props = this.props;

  state: {
    chartTab: string,
    nodeTab: string,
    canLoadMoreRemotes: boolean,
  } = {
    chartTab: '1 hour band',
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
    nodeTab: Object.keys(this.props.system.cluster_info)[0],
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ chartTab: string; nodeTab: string; remotes... Remove this comment to see the full error message
    remotes: getSlicedRemotes(this.props.health.data.remote),
    canLoadMoreRemotes:
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      this.props.health.data.remote && this.props.health.data.remote.length > 5,
  };

  componentWillMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
    this.props.dispatch(actions.system.init());
  }

  componentWillUnmount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
    this.props.dispatch(actions.system.unsync());
  }

  handleChartTabChange: Function = (event: any, chartTab: string): void => {
    this.setState({
      chartTab,
    });
  };

  handleNodeTabChange: Function = (event: any, nodeTab: string): void => {
    this.setState({
      nodeTab,
    });
  };
  handleModuleClick: Function = (url: string): void => {
    browserHistory.push(url);
  };

  handleLoadMoreRemotesClick: Function = (): void => {
    this.setState({
      canLoadMoreRemotes: !this.state.canLoadMoreRemotes,
      remotes: !this.state.canLoadMoreRemotes
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        ? getSlicedRemotes(this.props.health.data.remote)
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        : this.props.health.data.remote,
    });
  };

  hasModule = (mod) =>
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    this.props.currentUser.data.storage.settings.dashboardModules.includes(mod);

  getModulesCount = () =>
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    this.props.currentUser.data.storage.settings.dashboardModules.length;

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    if (!this.props.health.sync) return <Loader />;

    const { system, health, isTablet } = this.props;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'remotes' does not exist on type '{ chart... Remove this comment to see the full error message
    let { remotes, canLoadMoreRemotes } = this.state;

    remotes = remotes || [];
    canLoadMoreRemotes = canLoadMoreRemotes || null;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
    const clusterMemory = Object.keys(system.cluster_info).reduce(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
      (cur, node: string) => cur + system.cluster_info[node].node_priv,
      0
    );

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
    const currentNodeData = system.cluster_info[this.state.nodeTab];
    const history = prepareHistory(currentNodeData.mem_history);
    const procHistory = prepareHistory(currentNodeData.process_history);
    const flattenedHistory = history.map((hist: Object): number =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'node_priv' does not exist on type 'Objec... Remove this comment to see the full error message
      parseFloat(calculateMemory(hist.node_priv, null, false), 10)
    );
    const flattenedInUseHistory = history.map((hist: Object): number =>
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'node_ram_in_use' does not exist on type ... Remove this comment to see the full error message
      parseFloat(calculateMemory(hist.node_ram_in_use, null, false), 10)
    );
    const historyMax = Math.max(...flattenedHistory);
    const inUseHistoryMax = Math.max(...flattenedInUseHistory);
    const totalRamInt = parseFloat(
      calculateMemory(currentNodeData.node_ram, null, false),
      // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
      10
    );
    let yMax = totalRamInt;

    const memoryLimitChart = {
      data: [...Array(15)].map(() => totalRamInt),
      backgroundColor: COLORS.danger,
      borderColor: COLORS.danger,
      fill: false,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
      label: this.props.intl.formatMessage({ id: 'dashboard.total-node-ram' }),
      pointRadius: 0,
      borderWidth: 1,
    };

    // The highest memory value is larger than the node total RAM
    if (historyMax > totalRamInt) {
      yMax = historyMax;
    } else if (inUseHistoryMax > totalRamInt) {
      yMax = inUseHistoryMax;
    }

    const nodeChart = {
      data: history.map((hist: Object): number =>
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'node_priv' does not exist on type 'Objec... Remove this comment to see the full error message
        calculateMemory(hist.node_priv, null, false)
      ),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
      label: this.props.intl.formatMessage({
        id: 'dashboard.ram-used-by-qorus',
      }),
      backgroundColor: COLORS.cobalt,
      borderColor: COLORS.cobalt,
      fill: false,
      pointRadius: 1,
      borderWidth: 3,
      lineTension: 0,
    };

    const nodeInUseChart = {
      data: history.map((hist: Object): number =>
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'node_ram_in_use' does not exist on type ... Remove this comment to see the full error message
        calculateMemory(hist.node_ram_in_use, null, false)
      ),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
      label: this.props.intl.formatMessage({ id: 'dashboard.total-ram-used' }),
      backgroundColor: COLORS.gray,
      borderColor: COLORS.gray,
      fill: false,
      pointRadius: 1,
      borderWidth: 2,
      lineTension: 0,
    };

    const nodeProcChart = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'count' does not exist on type 'Object'.
      data: procHistory.map((hist: Object): number => hist.count),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
      label: this.props.intl.formatMessage({
        id: 'dashboard.running-processes',
      }),
      backgroundColor: COLORS.cobalt,
      borderColor: COLORS.cobalt,
      fill: false,
      pointRadius: 1,
      borderWidth: 3,
      lineTension: 0,
    };

    const nodeCPUChart = {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'node_load_pct' does not exist on type 'O... Remove this comment to see the full error message
      data: history.map((hist: Object): number => round(hist.node_load_pct, 2)),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
      label: this.props.intl.formatMessage({ id: 'dashboard.cpu-load' }),
      backgroundColor: COLORS.cobalt,
      borderColor: COLORS.cobalt,
      fill: false,
      pointRadius: 1,
      borderWidth: 3,
      lineTension: 0,
    };

    return (
      <Flex>
        <Headbar>
          <Breadcrumbs>
            <Crumb active>
              <FormattedMessage id="Dashboard" />
            </Crumb>
          </Breadcrumbs>
          <Pull right>
            <ButtonGroup>
              <Button
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                text={this.props.intl.formatMessage({ id: 'button.settings' })}
                icon="cog"
                onClick={() => {
                  browserHistory.push('/user?tab=settings#dashboard');
                }}
              />
            </ButtonGroup>
          </Pull>
        </Headbar>
        <Flex scrollY>
          <MasonryLayout
            columns={this.getModulesCount() < 4 ? 1 : isTablet ? 2 : 3}
          >
            { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message */ }
            {this.hasModule('orderStats') && system.order_stats && (
              <MasonryPanel>
                <DashboardModule>
                  <MultiDispositionChart
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'stats.global-order-stats',
                    })}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
                    orderStats={system.order_stats}
                    onDispositionChartClick={(band) => {
                      this.props.openModal(
                        <GlobalModal
                          onClose={this.props.closeModal}
                          text="Global chart data"
                          band={band}
                        />
                      );
                    }}
                    onSLAChartClick={(band) => {
                      this.props.openModal(
                        <SLAModal
                          onClose={this.props.closeModal}
                          in_sla
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                          text={this.props.intl.formatMessage({
                            id: 'stats.in-sla',
                          })}
                          band={band}
                        />
                      );
                    }}
                  />
                </DashboardModule>
              </MasonryPanel>
            )}
            {this.hasModule('interfaces') && (
              <MasonryPanel>
                <DashboardModule>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.interfaces',
                    })}
                  >
                    <div className="dashboard-data-module has-link">
                      <div
                        className="dashboard-data-title"
                        onClick={() => this.handleModuleClick('/workflows')}
                      >
                        {' '}
                        <FormattedMessage id="Workflows" />{' '}
                      </div>
                      <div
                        className="dashboard-data-top"
                        onClick={() => this.handleModuleClick('/workflows')}
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow_total' does not exist on type '... Remove this comment to see the full error message */ }
                          {system.workflow_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow_alerts' does not exist on type ... Remove this comment to see the full error message
                          system.workflow_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/workflows?search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'workflow_alerts' does not exist on type ... Remove this comment to see the full error message */ }
                          {system.workflow_alerts}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="dashboard.with-alerts" />{' '}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-data-module has-link">
                      <div
                        className="dashboard-data-title"
                        onClick={() => this.handleModuleClick('/services')}
                      >
                        {' '}
                        <FormattedMessage id="Services" />{' '}
                      </div>
                      <div
                        className="dashboard-data-top"
                        onClick={() => this.handleModuleClick('/services')}
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'service_total' does not exist on type 'O... Remove this comment to see the full error message */ }
                          {system.service_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'service_alerts' does not exist on type '... Remove this comment to see the full error message
                          system.service_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/services?search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'service_alerts' does not exist on type '... Remove this comment to see the full error message */ }
                          {system.service_alerts}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="dashboard.with-alerts" />{' '}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-data-module has-link">
                      <div
                        className="dashboard-data-title"
                        onClick={() => this.handleModuleClick('/jobs')}
                      >
                        {' '}
                        <FormattedMessage id="Jobs" />{' '}
                      </div>
                      <div
                        className="dashboard-data-top"
                        onClick={() => this.handleModuleClick('/jobs')}
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'job_total' does not exist on type 'Objec... Remove this comment to see the full error message */ }
                          {system.job_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'job_alerts' does not exist on type 'Obje... Remove this comment to see the full error message
                          system.job_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick('/jobs?search=has_alerts:true')
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'job_alerts' does not exist on type 'Obje... Remove this comment to see the full error message */ }
                          {system.job_alerts}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="dashboard.with-alerts" />{' '}
                        </div>
                      </div>
                    </div>
                  </PaneItem>
                </DashboardModule>
              </MasonryPanel>
            )}
            {this.hasModule('connections') && (
              <MasonryPanel>
                <DashboardModule>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'Connections',
                    })}
                  >
                    <div className="dashboard-data-module has-link">
                      <div
                        className="dashboard-data-title"
                        onClick={() =>
                          this.handleModuleClick('/remote?tab=qorus')
                        }
                      >
                        Qorus
                      </div>
                      <div
                        className="dashboard-data-top"
                        onClick={() =>
                          this.handleModuleClick('/remote?tab=qorus')
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'remote_total' does not exist on type 'Ob... Remove this comment to see the full error message */ }
                          {system.remote_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'remote_alerts' does not exist on type 'O... Remove this comment to see the full error message
                          system.remote_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/remote?tab=qorus&search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'remote_alerts' does not exist on type 'O... Remove this comment to see the full error message */ }
                          {system.remote_alerts}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="dashboard.with-alerts" />{' '}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-data-module has-link">
                      <div
                        className="dashboard-data-title"
                        onClick={() => this.handleModuleClick('/remote')}
                      >
                        <FormattedMessage id="dashboard.datasource" />
                      </div>
                      <div
                        className="dashboard-data-top"
                        onClick={() => this.handleModuleClick('/remote')}
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'datasource_total' does not exist on type... Remove this comment to see the full error message */ }
                          {system.datasource_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'datasource_alerts' does not exist on typ... Remove this comment to see the full error message
                          system.datasource_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/remote?search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'datasource_alerts' does not exist on typ... Remove this comment to see the full error message */ }
                          {system.datasource_alerts}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="dashboard.with-alerts" />{' '}
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-data-module has-link">
                      <div
                        className="dashboard-data-title"
                        onClick={() =>
                          this.handleModuleClick('/remote?tab=user')
                        }
                      >
                        <FormattedMessage id="global.user-connection" />
                      </div>
                      <div
                        className="dashboard-data-top"
                        onClick={() =>
                          this.handleModuleClick('/remote?tab=user')
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'user_total' does not exist on type 'Obje... Remove this comment to see the full error message */ }
                          {system.user_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'user_alerts' does not exist on type 'Obj... Remove this comment to see the full error message
                          system.user_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/remote?tab=user&search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'user_alerts' does not exist on type 'Obj... Remove this comment to see the full error message */ }
                          {system.user_alerts}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="dashboard.with-alerts" />{' '}
                        </div>
                      </div>
                    </div>
                  </PaneItem>
                </DashboardModule>
              </MasonryPanel>
            )}
            {this.hasModule('cluster') && (
              <MasonryPanel>
                <DashboardModule>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.cluster',
                    })}
                  >
                    <div className="module-wrapper">
                      <div className="dashboard-module-small">
                        <div className="top">
                          {calculateMemory(clusterMemory)}
                        </div>
                        <div className="bottom">
                          <FormattedMessage id="dashboard.memory" />
                        </div>
                      </div>
                      <div className="dashboard-module-small">
                        <div className="top">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message */ }
                          {Object.keys(system.cluster_info).length}
                        </div>
                        <div className="bottom">
                          <FormattedMessage id="dashboard.nodes" />
                        </div>
                      </div>
                      <div className="dashboard-module-small">
                        <div className="top">
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'processes' does not exist on type 'Objec... Remove this comment to see the full error message */ }
                          {Object.keys(system.processes).length}
                        </div>
                        <div className="bottom">
                          <FormattedMessage id="dashboard.processes" />
                        </div>
                      </div>
                    </div>
                    { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message */ }
                    {Object.keys(system.cluster_info).map((node: string) => {
                      const memory: string = calculateMemory(
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
                        system.cluster_info[node].node_priv
                      );

                      const memoryInUse: string = calculateMemory(
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
                        system.cluster_info[node].node_ram_in_use
                      );

                      const loadPct: string =
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
                        system.cluster_info[node].node_load_pct;

                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'processes' does not exist on type 'Objec... Remove this comment to see the full error message
                      const processName = Object.keys(system.processes).find(
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'processes' does not exist on type 'Objec... Remove this comment to see the full error message
                        (process) => system.processes[process].node === node
                      );

                      const processes: number = Object.keys(
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'processes' does not exist on type 'Objec... Remove this comment to see the full error message
                        system.processes
                      ).filter(
                        (process: string) =>
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'processes' does not exist on type 'Objec... Remove this comment to see the full error message
                          system.processes[process].node === node
                      ).length;

                      return (
                        <div
                          className="dashboard-module-wide has-link"
                          key={node}
                          onClick={() =>
                            this.handleModuleClick('/system/cluster')
                          }
                        >
                          <div className="dashboard-data-title">{node}</div>
                          <div className="bottom">
                            <div className="module">
                              <div className="top">{memory}</div>
                              <div className="bottom">
                                <FormattedMessage id="dashboard.ram-used-by-qorus" />
                              </div>
                            </div>
                            <div className="module">
                              <div className="top">{processes}</div>
                              <div className="bottom">
                                <FormattedMessage id="dashboard.processes" />
                              </div>
                            </div>
                          </div>
                          <div className="bottom">
                            <div className="module">
                              <div className="top">{memoryInUse}</div>
                              <div className="bottom">
                                <FormattedMessage id="dashboard.total-ram-used" />
                              </div>
                            </div>
                            <div className="module">
                              <div className="top">{round(loadPct, 2)}%</div>
                              <div className="bottom">
                                <FormattedMessage id="dashboard.cpu-load" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </PaneItem>
                </DashboardModule>
              </MasonryPanel>
            )}
            {this.hasModule('overview') && (
              <MasonryPanel>
                <DashboardModule>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.system-overview',
                    })}
                  >
                    <div className="dashboard-module-overview">
                      <div className="module overview-module">
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'. */ }
                        <div>{health.data['instance-key']}</div>
                        <div>
                          <FormattedMessage id="dashboard.instance" />
                        </div>
                      </div>
                      <div
                        className={`module overview-module ${statusHealth(
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
                          health.data.health
                        )}`}
                      >
                        { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'. */ }
                        <div>{health.data.health}</div>
                        <div>
                          <FormattedMessage id="dashboard.health" />
                        </div>
                      </div>
                    </div>
                    <div className="dashboard-module-overview">
                      <div
                        className={`module overview-module ${
                          system['alert-summary'].ongoing !== 0
                            ? 'danger'
                            : 'none'
                        } has-link`}
                        onClick={() => this.handleModuleClick('/system/alerts')}
                      >
                        <div>{system['alert-summary'].ongoing}</div>
                        <div>
                          <FormattedMessage id="dashboard.ongoing-alerts" />
                        </div>
                      </div>
                      <div
                        className={`module overview-module ${
                          system['alert-summary'].transient !== 0
                            ? 'danger'
                            : 'success'
                        } has-link`}
                        onClick={() =>
                          this.handleModuleClick('/system/alerts?tab=transient')
                        }
                      >
                        <div>{system['alert-summary'].transient}</div>
                        <div>
                          <FormattedMessage id="dashboard.transient-alerts" />
                        </div>
                      </div>
                    </div>
                  </PaneItem>
                </DashboardModule>
              </MasonryPanel>
            )}
            {this.hasModule('remotes') && remotes.length ? (
              <MasonryPanel>
                <DashboardModule>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.remote-instances',
                    })}
                  >
                    {remotes.map((remote: Object) => (
                      <div
                        className="dashboard-module-wide has-link"
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                        key={remote.name}
                        onClick={() =>
                          this.handleModuleClick(
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'.
                            `/remote?tab=qorus&paneId=${remote.name}`
                          )
                        }
                      >
                        <div
                          className={`dashboard-data-title ${statusHealth(
                            // @ts-expect-error ts-migrate(2339) FIXME: Property 'health' does not exist on type 'Object'.
                            remote.health
                          )}`}
                        >
                          { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Object'. */ }
                          {remote.name}
                        </div>
                        <div
                          // @ts-expect-error ts-migrate(2339) FIXME: Property 'health' does not exist on type 'Object'.
                          className={`bottom ${statusHealth(remote.health)}`}
                        >
                          <div
                            className="module"
                            style={{
                              // @ts-expect-error ts-migrate(2339) FIXME: Property 'health' does not exist on type 'Object'.
                              opacity: remote.health === 'UNKNOWN' ? 0.4 : 1,
                            }}
                          >
                            <div className="top">{remote['instance-key']}</div>
                            <div className="bottom">
                              <FormattedMessage id="dashboard.key" />
                            </div>
                          </div>
                          <div
                            className="module"
                            style={{
                              // @ts-expect-error ts-migrate(2339) FIXME: Property 'health' does not exist on type 'Object'.
                              opacity: remote.health === 'UNKNOWN' ? 0.4 : 1,
                            }}
                          >
                            { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'health' does not exist on type 'Object'. */ }
                            <div className="top">{remote.health}</div>
                            <div className="bottom">
                              <FormattedMessage id="dashboard.health" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {canLoadMoreRemotes && (
                      <div
                        className="dashboard-data-loadmore"
                        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
                        onClick={this.handleLoadMoreRemotesClick}
                      >
                        <FormattedMessage id="global.show-all" />
                      </div>
                    )}
                    {!canLoadMoreRemotes && remotes.length > 5 ? (
                      <div
                        className="dashboard-data-loadmore"
                        // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'MouseEv... Remove this comment to see the full error message
                        onClick={this.handleLoadMoreRemotesClick}
                      >
                        Show less
                      </div>
                    ) : null}
                  </PaneItem>
                </DashboardModule>
              </MasonryPanel>
            ) : null}
            {this.hasModule('nodeData') && (
              <MasonryPanel>
                <DashboardModule>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.node-memory-progression',
                    })}
                    label={
                      <Nodes
                        nodeTab={this.state.nodeTab}
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'cluster_info' does not exist on type 'Ob... Remove this comment to see the full error message
                        nodes={Object.keys(system.cluster_info)}
                        onNodeTabChange={this.handleNodeTabChange}
                      />
                    }
                  >
                    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
                    <ChartComponent
                      id={this.state.nodeTab}
                      title={
                        `${this.state.nodeTab} (${calculateMemory(
                          currentNodeData.node_ram
                        )} ` +
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                        this.props.intl.formatMessage({
                          id: 'dashboard.total-ram',
                        }) +
                        ')'
                      }
                      width="100%"
                      height={115}
                      isNotTime
                      stepSize={(yMax + yMax / 10) / 3}
                      unit=" GiB"
                      yMax={yMax}
                      empty={currentNodeData.mem_history.length === 0}
                      labels={history.map((hist: Object): string =>
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'timestamp' does not exist on type 'Objec... Remove this comment to see the full error message
                        formatChartTime(hist.timestamp)
                      )}
                      datasets={
                        memoryLimitChart
                          ? [nodeChart, nodeInUseChart, memoryLimitChart]
                          : [nodeChart, nodeInUseChart]
                      }
                    />
                  </PaneItem>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.node-cpu-load',
                    })}
                  >
                    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
                    <ChartComponent
                      id={this.state.nodeTab}
                      title={
                        `${this.state.nodeTab} (${currentNodeData.node_cpu_count} ` +
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                        this.props.intl.formatMessage({
                          id: 'dashboard.cpu-cores',
                        }) +
                        ')'
                      }
                      width="100%"
                      height={115}
                      isNotTime
                      unit="%"
                      empty={currentNodeData.mem_history.length === 0}
                      labels={procHistory.map((hist: Object): string =>
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'timestamp' does not exist on type 'Objec... Remove this comment to see the full error message
                        formatChartTime(hist.timestamp)
                      )}
                      datasets={[nodeCPUChart]}
                    />
                  </PaneItem>
                  <PaneItem
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.node-process-count-history',
                    })}
                  >
                    { /* @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call. */ }
                    <ChartComponent
                      id={this.state.nodeTab}
                      title={
                        `${this.state.nodeTab} (${currentNodeData.process_count} ` +
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type 'Props'.
                        this.props.intl.formatMessage({
                          id:
                            currentNodeData.process_count > 4
                              ? 'dashboard.processes-gt-4-lc'
                              : 'dashboard.processes-lc',
                        }) +
                        ')'
                      }
                      width="100%"
                      height={115}
                      isNotTime
                      unit=" "
                      stepSize={20}
                      empty={procHistory.length === 0}
                      labels={procHistory.map((hist: Object): string =>
                        // @ts-expect-error ts-migrate(2339) FIXME: Property 'timestamp' does not exist on type 'Objec... Remove this comment to see the full error message
                        formatChartTime(hist.timestamp)
                      )}
                      datasets={[nodeProcChart]}
                    />
                  </PaneItem>
                </DashboardModule>
              </MasonryPanel>
            )}
          </MasonryLayout>
        </Flex>
      </Flex>
    );
  }
}
