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
    nodeTab: Object.keys(this.props.system.cluster_info)[0],
    remotes: getSlicedRemotes(this.props.health.data.remote),
    canLoadMoreRemotes:
      this.props.health.data.remote && this.props.health.data.remote.length > 5,
  };

  componentWillMount() {
    this.props.dispatch(actions.system.init());
  }

  componentWillUnmount() {
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
        ? getSlicedRemotes(this.props.health.data.remote)
        : this.props.health.data.remote,
    });
  };

  hasModule = (mod) =>
    this.props.currentUser.data.storage.settings.dashboardModules.includes(mod);

  getModulesCount = () =>
    this.props.currentUser.data.storage.settings.dashboardModules.length;

  render() {
    if (!this.props.health.sync) return <Loader />;

    const { system, health, isTablet } = this.props;
    let { remotes, canLoadMoreRemotes } = this.state;

    remotes = remotes || [];
    canLoadMoreRemotes = canLoadMoreRemotes || null;

    const clusterMemory = Object.keys(system.cluster_info).reduce(
      (cur, node: string) => cur + system.cluster_info[node].node_priv,
      0
    );

    const currentNodeData = system.cluster_info[this.state.nodeTab];
    const history = prepareHistory(currentNodeData.mem_history);
    const procHistory = prepareHistory(currentNodeData.process_history);
    const flattenedHistory = history.map((hist: Object): number =>
      parseFloat(calculateMemory(hist.node_priv, null, false), 10)
    );
    const flattenedInUseHistory = history.map((hist: Object): number =>
      parseFloat(calculateMemory(hist.node_ram_in_use, null, false), 10)
    );
    const historyMax = Math.max(...flattenedHistory);
    const inUseHistoryMax = Math.max(...flattenedInUseHistory);
    const totalRamInt = parseFloat(
      calculateMemory(currentNodeData.node_ram, null, false),
      10
    );
    let yMax = totalRamInt;

    const memoryLimitChart = {
      data: [...Array(15)].map(() => totalRamInt),
      backgroundColor: COLORS.danger,
      borderColor: COLORS.danger,
      fill: false,
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
        calculateMemory(hist.node_priv, null, false)
      ),
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
        calculateMemory(hist.node_ram_in_use, null, false)
      ),
      label: this.props.intl.formatMessage({ id: 'dashboard.total-ram-used' }),
      backgroundColor: COLORS.gray,
      borderColor: COLORS.gray,
      fill: false,
      pointRadius: 1,
      borderWidth: 2,
      lineTension: 0,
    };

    const nodeProcChart = {
      data: procHistory.map((hist: Object): number => hist.count),
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
      data: history.map((hist: Object): number => round(hist.node_load_pct, 2)),
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
            {this.hasModule('orderStats') && system.order_stats && (
              <MasonryPanel>
                <DashboardModule>
                  <MultiDispositionChart
                    title={this.props.intl.formatMessage({
                      id: 'stats.global-order-stats',
                    })}
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
                          {system.workflow_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          system.workflow_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/workflows?search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
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
                          {system.service_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          system.service_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/services?search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
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
                          {system.job_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          system.job_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick('/jobs?search=has_alerts:true')
                        }
                      >
                        <div className="db-data-content">
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
                          {system.remote_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          system.remote_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/remote?tab=qorus&search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
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
                          {system.datasource_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          system.datasource_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/remote?search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
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
                          {system.user_total}
                        </div>
                        <div className="db-data-label">
                          {' '}
                          <FormattedMessage id="global.total" />{' '}
                        </div>
                      </div>
                      <div
                        className={`dashboard-data-bottom ${
                          system.user_alerts ? 'has-alerts' : ''
                        }`}
                        onClick={() =>
                          this.handleModuleClick(
                            '/remote?tab=user&search=has_alerts:true'
                          )
                        }
                      >
                        <div className="db-data-content">
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
                          {Object.keys(system.cluster_info).length}
                        </div>
                        <div className="bottom">
                          <FormattedMessage id="dashboard.nodes" />
                        </div>
                      </div>
                      <div className="dashboard-module-small">
                        <div className="top">
                          {Object.keys(system.processes).length}
                        </div>
                        <div className="bottom">
                          <FormattedMessage id="dashboard.processes" />
                        </div>
                      </div>
                    </div>
                    {Object.keys(system.cluster_info).map((node: string) => {
                      const memory: string = calculateMemory(
                        system.cluster_info[node].node_priv
                      );

                      const memoryInUse: string = calculateMemory(
                        system.cluster_info[node].node_ram_in_use
                      );

                      const loadPct: string =
                        system.cluster_info[node].node_load_pct;

                      const processName = Object.keys(system.processes).find(
                        (process) => system.processes[process].node === node
                      );

                      const processes: number = Object.keys(
                        system.processes
                      ).filter(
                        (process: string) =>
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
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.system-overview',
                    })}
                  >
                    <div className="dashboard-module-overview">
                      <div className="module overview-module">
                        <div>{health.data['instance-key']}</div>
                        <div>
                          <FormattedMessage id="dashboard.instance" />
                        </div>
                      </div>
                      <div
                        className={`module overview-module ${statusHealth(
                          health.data.health
                        )}`}
                      >
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
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.remote-instances',
                    })}
                  >
                    {remotes.map((remote: Object) => (
                      <div
                        className="dashboard-module-wide has-link"
                        key={remote.name}
                        onClick={() =>
                          this.handleModuleClick(
                            `/remote?tab=qorus&paneId=${remote.name}`
                          )
                        }
                      >
                        <div
                          className={`dashboard-data-title ${statusHealth(
                            remote.health
                          )}`}
                        >
                          {remote.name}
                        </div>
                        <div
                          className={`bottom ${statusHealth(remote.health)}`}
                        >
                          <div
                            className="module"
                            style={{
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
                              opacity: remote.health === 'UNKNOWN' ? 0.4 : 1,
                            }}
                          >
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
                        onClick={this.handleLoadMoreRemotesClick}
                      >
                        <FormattedMessage id="global.show-all" />
                      </div>
                    )}
                    {!canLoadMoreRemotes && remotes.length > 5 ? (
                      <div
                        className="dashboard-data-loadmore"
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
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.node-memory-progression',
                    })}
                    label={
                      <Nodes
                        nodeTab={this.state.nodeTab}
                        nodes={Object.keys(system.cluster_info)}
                        onNodeTabChange={this.handleNodeTabChange}
                      />
                    }
                  >
                    <ChartComponent
                      id={this.state.nodeTab}
                      title={
                        `${this.state.nodeTab} (${calculateMemory(
                          currentNodeData.node_ram
                        )} ` +
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
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.node-cpu-load',
                    })}
                  >
                    <ChartComponent
                      id={this.state.nodeTab}
                      title={
                        `${this.state.nodeTab} (${currentNodeData.node_cpu_count} ` +
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
                        formatChartTime(hist.timestamp)
                      )}
                      datasets={[nodeCPUChart]}
                    />
                  </PaneItem>
                  <PaneItem
                    title={this.props.intl.formatMessage({
                      id: 'dashboard.node-process-count-history',
                    })}
                  >
                    <ChartComponent
                      id={this.state.nodeTab}
                      title={
                        `${this.state.nodeTab} (${currentNodeData.process_count} ` +
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
