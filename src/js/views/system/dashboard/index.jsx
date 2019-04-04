import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import map from 'lodash/map';
import round from 'lodash/round';
import { browserHistory } from 'react-router';

import Loader from '../../../components/loader';
import actions from '../../../store/api/actions';
import DashboardModule from '../../../components/dashboard_module/index';
import PaneItem from '../../../components/pane_item';
import {
  statusHealth,
  calculateMemory,
  getSlicedRemotes,
} from '../../../helpers/system';
import ChartComponent from '../../../components/chart';
import { prepareHistory, formatChartTime } from '../../../helpers/chart';
import withModal from '../../../hocomponents/modal';
import StatsModal from './statsModal';
import SLAModal from './modals/sla';
import GlobalModal from './modals/global';
import { DISPOSITIONS } from '../../../constants/dashboard';
import titleManager from '../../../hocomponents/TitleManager';
import { COLORS } from '../../../constants/ui';
import MultiDispositionChart from '../../../components/MultiDispositionChart';
import Flex from '../../../components/Flex';
import { MasonryLayout, MasonryPanel } from '../../../components/MasonryLayout';
import Nodes from './dropdowns/Nodes';

const viewSelector = createSelector(
  [
    state => state.api.health,
    state => state.api.system,
    state => state.ui,
    state => state.api.currentUser,
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

  componentWillMount () {
    this.props.dispatch(actions.system.fetch());
    this.props.dispatch(actions.health.fetch());
    this.props.dispatch(actions.system.init());
  }

  componentWillUnmount () {
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
  handleModuleClick: Function = (connection: string): void => {
    browserHistory.push(`/remote?tab=qorus&paneId=${connection}`);
  };

  handleLoadMoreRemotesClick: Function = (): void => {
    this.setState({
      canLoadMoreRemotes: !this.state.canLoadMoreRemotes,
      remotes: !this.state.canLoadMoreRemotes
        ? getSlicedRemotes(this.props.health.data.remote)
        : this.props.health.data.remote,
    });
  };

  render () {
    if (!this.props.health.sync) return <Loader />;

    const { system, health, isTablet, currentUser } = this.props;
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
    const flattenedHistory = history.map(
      (hist: Object): number =>
        parseFloat(calculateMemory(hist.node_priv, null, false), 10)
    );
    const flattenedInUseHistory = history.map(
      (hist: Object): number =>
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
      label: 'Total node RAM',
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
      data: history.map(
        (hist: Object): number => calculateMemory(hist.node_priv, null, false)
      ),
      label: 'RAM used by Qorus',
      backgroundColor: COLORS.cobalt,
      borderColor: COLORS.cobalt,
      fill: false,
      pointRadius: 1,
      borderWidth: 3,
      lineTension: 0,
    };

    const nodeInUseChart = {
      data: history.map(
        (hist: Object): number =>
          calculateMemory(hist.node_ram_in_use, null, false)
      ),
      label: 'Total RAM used',
      backgroundColor: COLORS.gray,
      borderColor: COLORS.gray,
      fill: false,
      pointRadius: 1,
      borderWidth: 2,
      lineTension: 0,
    };

    const nodeProcChart = {
      data: procHistory.map((hist: Object): number => hist.count),
      label: 'Running processes',
      backgroundColor: COLORS.cobalt,
      borderColor: COLORS.cobalt,
      fill: false,
      pointRadius: 1,
      borderWidth: 3,
      lineTension: 0,
    };

    const nodeCPUChart = {
      data: history.map((hist: Object): number => round(hist.node_load_pct, 2)),
      label: 'CPU load',
      backgroundColor: COLORS.cobalt,
      borderColor: COLORS.cobalt,
      fill: false,
      pointRadius: 1,
      borderWidth: 3,
      lineTension: 0,
    };

    return (
      <Flex scrollY>
        <MasonryLayout columns={isTablet ? 2 : 3}>
          {system.order_stats && (
            <MasonryPanel>
              <DashboardModule>
                <MultiDispositionChart
                  title="Global order stats"
                  orderStats={system.order_stats}
                  onDispositionChartClick={() => {
                    this.props.openModal(
                      <GlobalModal
                        onClose={this.props.closeModal}
                        text="Global chart data"
                        band={this.state.chartTab}
                      />
                    );
                  }}
                  dispositionLegendHandlers={map(
                    DISPOSITIONS,
                    (label, disp) => () => {
                      this.props.openModal(
                        <StatsModal
                          onClose={this.props.closeModal}
                          disposition={disp}
                          text={label}
                          band={this.state.chartTab}
                        />
                      );
                    }
                  )}
                  onSLAChartClick={() => {
                    this.props.openModal(
                      <SLAModal
                        onClose={this.props.closeModal}
                        in_sla
                        text="In SLA"
                        band={this.state.chartTab}
                      />
                    );
                  }}
                />
              </DashboardModule>
            </MasonryPanel>
          )}
          <MasonryPanel>
            <DashboardModule>
              <PaneItem title="Interfaces">
                <div className="dashboard-data-module has-link">
                  <div
                    className="dashboard-data-title"
                    onClick={() => this.handleModuleClick('/workflows')}
                  >
                    {' '}
                    Workflows{' '}
                  </div>
                  <div
                    className="dashboard-data-top"
                    onClick={() => this.handleModuleClick('/workflows')}
                  >
                    <div className="db-data-content">
                      {system.workflow_total}
                    </div>
                    <div className="db-data-label"> total </div>
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
                    <div className="db-data-label"> with alerts </div>
                  </div>
                </div>
                <div className="dashboard-data-module has-link">
                  <div
                    className="dashboard-data-title"
                    onClick={() => this.handleModuleClick('/services')}
                  >
                    {' '}
                    Services{' '}
                  </div>
                  <div
                    className="dashboard-data-top"
                    onClick={() => this.handleModuleClick('/services')}
                  >
                    <div className="db-data-content">
                      {system.service_total}
                    </div>
                    <div className="db-data-label"> total </div>
                  </div>
                  <div
                    className={`dashboard-data-bottom ${
                      system.service_alerts ? 'has-alerts' : ''
                    }`}
                    onClick={() =>
                      this.handleModuleClick('/services?search=has_alerts:true')
                    }
                  >
                    <div className="db-data-content">
                      {system.service_alerts}
                    </div>
                    <div className="db-data-label"> with alerts </div>
                  </div>
                </div>
                <div className="dashboard-data-module has-link">
                  <div
                    className="dashboard-data-title"
                    onClick={() => this.handleModuleClick('/jobs')}
                  >
                    {' '}
                    Jobs{' '}
                  </div>
                  <div
                    className="dashboard-data-top"
                    onClick={() => this.handleModuleClick('/jobs')}
                  >
                    <div className="db-data-content">{system.job_total}</div>
                    <div className="db-data-label"> total </div>
                  </div>
                  <div
                    className={`dashboard-data-bottom ${
                      system.job_alerts ? 'has-alerts' : ''
                    }`}
                    onClick={() =>
                      this.handleModuleClick('/jobs?search=has_alerts:true')
                    }
                  >
                    <div className="db-data-content">{system.job_alerts}</div>
                    <div className="db-data-label"> with alerts </div>
                  </div>
                </div>
              </PaneItem>
            </DashboardModule>
          </MasonryPanel>
          <MasonryPanel>
            <DashboardModule>
              <PaneItem title="Connections">
                <div className="dashboard-data-module has-link">
                  <div
                    className="dashboard-data-title"
                    onClick={() => this.handleModuleClick('/remote?tab=qorus')}
                  >
                    Qorus
                  </div>
                  <div
                    className="dashboard-data-top"
                    onClick={() => this.handleModuleClick('/remote?tab=qorus')}
                  >
                    <div className="db-data-content">{system.remote_total}</div>
                    <div className="db-data-label"> total </div>
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
                    <div className="db-data-label"> with alerts </div>
                  </div>
                </div>
                <div className="dashboard-data-module has-link">
                  <div
                    className="dashboard-data-title"
                    onClick={() => this.handleModuleClick('/remote')}
                  >
                    Datasource
                  </div>
                  <div
                    className="dashboard-data-top"
                    onClick={() => this.handleModuleClick('/remote')}
                  >
                    <div className="db-data-content">
                      {system.datasource_total}
                    </div>
                    <div className="db-data-label"> total </div>
                  </div>
                  <div
                    className={`dashboard-data-bottom ${
                      system.datasource_alerts ? 'has-alerts' : ''
                    }`}
                    onClick={() =>
                      this.handleModuleClick('/remote?search=has_alerts:true')
                    }
                  >
                    <div className="db-data-content">
                      {system.datasource_alerts}
                    </div>
                    <div className="db-data-label"> with alerts </div>
                  </div>
                </div>
                <div className="dashboard-data-module has-link">
                  <div
                    className="dashboard-data-title"
                    onClick={() => this.handleModuleClick('/remote?tab=user')}
                  >
                    User
                  </div>
                  <div
                    className="dashboard-data-top"
                    onClick={() => this.handleModuleClick('/remote?tab=user')}
                  >
                    <div className="db-data-content">{system.user_total}</div>
                    <div className="db-data-label"> total </div>
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
                    <div className="db-data-content">{system.user_alerts}</div>
                    <div className="db-data-label"> with alerts </div>
                  </div>
                </div>
              </PaneItem>
            </DashboardModule>
          </MasonryPanel>
          <MasonryPanel>
            <DashboardModule>
              <PaneItem title="Cluster">
                <div className="module-wrapper">
                  <div className="dashboard-module-small">
                    <div className="top">{calculateMemory(clusterMemory)}</div>
                    <div className="bottom">Memory</div>
                  </div>
                  <div className="dashboard-module-small">
                    <div className="top">
                      {Object.keys(system.cluster_info).length}
                    </div>
                    <div className="bottom">Node(s)</div>
                  </div>
                  <div className="dashboard-module-small">
                    <div className="top">
                      {Object.keys(system.processes).length}
                    </div>
                    <div className="bottom">Processes</div>
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
                    process => system.processes[process].node === node
                  );

                  const processes: number = Object.keys(
                    system.processes
                  ).filter(
                    (process: string) => system.processes[process].node === node
                  ).length;

                  return (
                    <div
                      className="dashboard-module-wide has-link"
                      key={node}
                      onClick={() => this.handleModuleClick('/system/cluster')}
                    >
                      <div className="dashboard-data-title">
                        {system.processes[processName].node}
                      </div>
                      <div className="bottom">
                        <div className="module">
                          <div className="top">{memory}</div>
                          <div className="bottom">RAM used by Qorus</div>
                        </div>
                        <div className="module">
                          <div className="top">{processes}</div>
                          <div className="bottom">Processes</div>
                        </div>
                      </div>
                      <div className="bottom">
                        <div className="module">
                          <div className="top">{memoryInUse}</div>
                          <div className="bottom">Total RAM used</div>
                        </div>
                        <div className="module">
                          <div className="top">{round(loadPct, 2)}%</div>
                          <div className="bottom">CPU load</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </PaneItem>
            </DashboardModule>
          </MasonryPanel>
          <MasonryPanel>
            <DashboardModule>
              <PaneItem title="System Overview">
                <div className="dashboard-module-overview">
                  <div className="module overview-module">
                    <div>{health.data['instance-key']}</div>
                    <div>instance</div>
                  </div>
                  <div
                    className={`module overview-module ${statusHealth(
                      health.data.health
                    )}`}
                  >
                    <div>{health.data.health}</div>
                    <div>health</div>
                  </div>
                </div>
                <div className="dashboard-module-overview">
                  <div
                    className={`module overview-module ${
                      system['alert-summary'].ongoing !== 0 ? 'danger' : 'none'
                    } has-link`}
                    onClick={() => this.handleModuleClick('/system/alerts')}
                  >
                    <div>{system['alert-summary'].ongoing}</div>
                    <div>ongoing alerts</div>
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
                    <div>transient alerts</div>
                  </div>
                </div>
              </PaneItem>
            </DashboardModule>
          </MasonryPanel>
          {remotes.length ? (
            <MasonryPanel>
              <DashboardModule>
                <PaneItem title="Remote Instances">
                  {remotes.map((remote: Object) => (
                    <div
                      className="dashboard-module-wide has-link"
                      key={remote.name}
                      onClick={() => this.handleModuleClick(remote.name)}
                    >
                      <div
                        className={`dashboard-data-title ${statusHealth(
                          remote.health
                        )}`}
                      >
                        {remote.name}
                      </div>
                      <div className={`bottom ${statusHealth(remote.health)}`}>
                        <div className="module">
                          <div className="top">{remote['instance-key']}</div>
                          <div className="bottom">key</div>
                        </div>
                        <div className="module">
                          <div className="top">{remote.health}</div>
                          <div className="bottom">health</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {canLoadMoreRemotes && (
                    <div
                      className="dashboard-data-loadmore"
                      onClick={this.handleLoadMoreRemotesClick}
                    >
                      Show all
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
          <MasonryPanel>
            <DashboardModule>
              <PaneItem
                title="Node Memory Progression"
                label={
                  <Nodes
                    nodeTab={this.state.nodeTab}
                    nodes={Object.keys(system.cluster_info)}
                    onTabChange={this.handleNodeTabChange}
                  />
                }
              >
                <ChartComponent
                  title={`${this.state.nodeTab} (${calculateMemory(
                    currentNodeData.node_ram
                  )} total RAM)`}
                  width="100%"
                  height={115}
                  isNotTime
                  stepSize={(yMax + yMax / 10) / 3}
                  unit=" GiB"
                  yMax={yMax}
                  empty={currentNodeData.mem_history.length === 0}
                  labels={history.map(
                    (hist: Object): string => formatChartTime(hist.timestamp)
                  )}
                  datasets={
                    memoryLimitChart
                      ? [nodeChart, nodeInUseChart, memoryLimitChart]
                      : [nodeChart, nodeInUseChart]
                  }
                />
              </PaneItem>
              <PaneItem title="Node CPU load">
                <ChartComponent
                  title={`${this.state.nodeTab} (${
                    currentNodeData.node_cpu_count
                  } CPUs)`}
                  width="100%"
                  height={115}
                  isNotTime
                  unit="%"
                  empty={currentNodeData.mem_history.length === 0}
                  labels={procHistory.map(
                    (hist: Object): string => formatChartTime(hist.timestamp)
                  )}
                  datasets={[nodeCPUChart]}
                />
              </PaneItem>
              <PaneItem title="Node Process Count History">
                <ChartComponent
                  title={`${this.state.nodeTab} (${
                    currentNodeData.process_count
                  } processes)`}
                  width="100%"
                  height={115}
                  isNotTime
                  unit=" "
                  stepSize={20}
                  empty={procHistory.length === 0}
                  labels={procHistory.map(
                    (hist: Object): string => formatChartTime(hist.timestamp)
                  )}
                  datasets={[nodeProcChart]}
                />
              </PaneItem>
            </DashboardModule>
          </MasonryPanel>
        </MasonryLayout>
      </Flex>
    );
  }
}
