import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Masonry from 'react-masonry-layout';
import map from 'lodash/map';
import { browserHistory } from 'react-router';

import Loader from '../../../components/loader';
import actions from 'store/api/actions';
import DashboardModule from '../../../components/dashboard_module/index';
import PaneItem from '../../../components/pane_item';
import { statusHealth, calculateMemory } from '../../../helpers/system';
import ChartComponent from '../../../components/chart';
import {
  getStatsCount,
  getStatsPct,
  prepareHistory,
  formatChartTime,
} from '../../../helpers/chart';
import Dropdown, { Control, Item } from '../../../components/dropdown';
import withModal from '../../../hocomponents/modal';
import StatsModal from './statsModal';
import SLAModal from './slaModal';
import GlobalModal from './modals/global';
import { DISPOSITIONS } from '../../../constants/dashboard';

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
    width: ui.settings.width,
    currentUser,
  })
);

@connect(viewSelector)
@withModal()
export default class Dashboard extends Component {
  props: {
    children: any,
    route?: Object,
    health: Object,
    dispatch: Function,
    location: Object,
    system: Object,
    width: number,
    currentUser: Object,
    openModal: Function,
    closeModal: Function,
  };

  state: {
    chartTab: string,
    nodeTab: string,
  } = {
    chartTab: '1 hour band',
    nodeTab: Object.keys(this.props.system.cluster_info)[0],
  };

  componentWillMount() {
    this.props.dispatch(actions.health.fetch());
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

  render() {
    if (!this.props.health.sync) return <Loader />;

    const { system, health, width, currentUser } = this.props;
    const clusterMemory = Object.keys(system.cluster_info).reduce(
      (cur, node: string) => cur + system.cluster_info[node].node_priv,
      0
    );
    const sidebarOpen =
      currentUser.sync && currentUser.data.storage.sidebarOpen
        ? currentUser.data.storage.sidebarOpen
        : false;

    const masonryKey = `${width}_${
      this.state.chartTab
    }_${sidebarOpen.toString()}`;

    const sizes =
      width > 1200
        ? [{ columns: 3, gutter: 20 }]
        : [{ columns: 2, gutter: 20 }];

    const currentNodeData = system.cluster_info[this.state.nodeTab];
    const history = prepareHistory(currentNodeData.mem_history);
    const procHistory = prepareHistory(currentNodeData.process_history);
    const flattenedHistory = history.map(
      (hist: Object): number =>
        parseFloat(calculateMemory(hist.node_priv, null, false), 10)
    );
    const historyMax = Math.max(...flattenedHistory);
    const totalRamInt = parseFloat(
      calculateMemory(currentNodeData.node_ram, null, false),
      10
    );
    let yMax = totalRamInt;

    const memoryLimitChart = {
      data: [...Array(15)].map(() => totalRamInt),
      backgroundColor: '#FF7373',
      borderColor: '#FF7373',
      fill: false,
      label: 'Total node memory',
      pointRadius: 0,
      borderWidth: 1,
    };

    // The highest memory value is larger than the node total RAM
    if (historyMax > totalRamInt) {
      yMax = historyMax;
    }

    const nodeChart = {
      data: history.map(
        (hist: Object): number => calculateMemory(hist.node_priv, null, false)
      ),
      label: this.state.nodeTab,
      backgroundColor: '#9b59b6',
      borderColor: '#9b59b6',
      fill: false,
    };

    const nodeProcChart = {
      data: procHistory.map(
        (hist: Object): number => calculateMemory(hist.count, null, false)
      ),
      label: this.state.nodeTab,
      backgroundColor: '#9b59b6',
      borderColor: '#9b59b6',
      fill: false,
    };

    return (
      <div className="tab-pane active">
        <Masonry
          id="dashboard-masonry"
          sizes={sizes}
          style={{ margin: '0 auto' }}
          infiniteScrollDisabled
          className={`masonry${width > 1200 ? 'Triple' : 'Double'}`}
          key={masonryKey}
        >
          {system.order_stats && (
            <DashboardModule>
              <PaneItem
                title="Global Order Stats"
                label={
                  <Dropdown>
                    <Control small>{this.state.chartTab}</Control>
                    <Item
                      title="1 hour band"
                      action={this.handleChartTabChange}
                    />
                    <Item
                      title="4 hour band"
                      action={this.handleChartTabChange}
                    />
                    <Item
                      title="24 hour band"
                      action={this.handleChartTabChange}
                    />
                  </Dropdown>
                }
              >
                {system.order_stats.map(
                  stats =>
                    stats.label.replace(/_/g, ' ') === this.state.chartTab && (
                      <div key={stats.label}>
                        <ChartComponent
                          title="Workflow Disposition"
                          onClick={() => {
                            this.props.openModal(
                              <GlobalModal
                                onClose={this.props.closeModal}
                                text="Global chart data"
                                band={this.state.chartTab}
                              />
                            );
                          }}
                          width={150}
                          height={150}
                          isNotTime
                          type="doughnut"
                          empty={stats.l.every(stat => stat.count === 0)}
                          legendHandlers={map(
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
                          labels={map(
                            DISPOSITIONS,
                            (label, disp) =>
                              `${label} (${Math.round(
                                stats.l.find(dt => dt.disposition === disp)
                                  ? stats.l.find(dt => dt.disposition === disp)
                                      .pct
                                  : 0
                              )}%)`
                          )}
                          datasets={[
                            {
                              data: map(
                                DISPOSITIONS,
                                (label, disp) =>
                                  stats.l.find(dt => dt.disposition === disp)
                                    ? stats.l.find(
                                        dt => dt.disposition === disp
                                      ).count
                                    : 0
                              ),
                              backgroundColor: [
                                '#81358a',
                                '#FF7373',
                                '#7fba27',
                              ],
                            },
                          ]}
                        />
                        <ChartComponent
                          title="SLA Stats"
                          width={150}
                          height={150}
                          isNotTime
                          type="doughnut"
                          empty={stats.sla.every(
                            (sla: Object) => sla.pct === 0
                          )}
                          onClick={() => {
                            this.props.openModal(
                              <SLAModal
                                onClose={this.props.closeModal}
                                in_sla
                                text="In SLA"
                                band={this.state.chartTab}
                              />
                            );
                          }}
                          labels={[
                            `In SLA (${Math.round(getStatsPct(true, stats))}%)`,
                            `Out of SLA (${Math.round(
                              getStatsPct(false, stats)
                            )}%)`,
                          ]}
                          datasets={[
                            {
                              data: [
                                Math.round(getStatsCount(true, stats)),
                                Math.round(getStatsCount(false, stats)),
                              ],
                              backgroundColor: ['#7fba27', '#FF7373'],
                            },
                          ]}
                        />
                      </div>
                    )
                )}
              </PaneItem>
            </DashboardModule>
          )}
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

                const processName = Object.keys(system.processes).find(
                  process => system.processes[process].node === node
                );

                const processes: number = Object.keys(system.processes).filter(
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
                        <div className="bottom">Memory</div>
                      </div>
                      <div className="module">
                        <div className="top">{processes}</div>
                        <div className="bottom">Processes</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </PaneItem>
          </DashboardModule>
          <DashboardModule>
            <PaneItem
              title="Node Memory Progression"
              label={
                <Dropdown>
                  <Control small>{this.state.nodeTab}</Control>
                  {map(system.cluster_info, node => (
                    <Item
                      key={node}
                      title={node}
                      action={this.handleNodeTabChange}
                    />
                  ))}
                </Dropdown>
              }
            >
              <ChartComponent
                title={`${this.state.nodeTab} (${calculateMemory(
                  currentNodeData.node_ram
                )} total RAM)`}
                width="100%"
                height={150}
                isNotTime
                yAxisLabel="Memory used"
                stepSize={(yMax + yMax / 10) / 3}
                unit=" GiB"
                yMax={yMax}
                empty={currentNodeData.mem_history.length === 0}
                labels={history.map(
                  (hist: Object): string => formatChartTime(hist.timestamp)
                )}
                datasets={
                  memoryLimitChart ? [nodeChart, memoryLimitChart] : [nodeChart]
                }
              />
            </PaneItem>
            <PaneItem title="Node Processes History">
              <ChartComponent
                title={`${this.state.nodeTab} (${
                  currentNodeData.process_count
                } processes)`}
                width="100%"
                height={150}
                isNotTime
                yAxisLabel="# of processes"
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
                  <div className="db-data-content">{system.workflow_total}</div>
                  <div className="db-data-label"> total </div>
                </div>
                <div
                  className={`dashboard-data-bottom ${
                    system.workflow_alerts ? 'has-alerts' : ''
                  }`}
                  onClick={() =>
                    this.handleModuleClick('/workflows?search=has_alerts:true')
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
                  <div className="db-data-content">{system.service_total}</div>
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
                  <div className="db-data-content">{system.service_alerts}</div>
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
          {health.data.remote && (
            <DashboardModule>
              <PaneItem title="Remote Instances">
                {health.data.remote.map((remote: Object) => (
                  <div
                    className="dashboard-module-wide has-link"
                    key={remote.name}
                    onClick={() => this.handleModuleClick(remote.url)}
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
              </PaneItem>
            </DashboardModule>
          )}
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
          <DashboardModule>
            <PaneItem title="Connections">
              <div className="dashboard-data-module has-link">
                <div
                  className="dashboard-data-title"
                  onClick={() =>
                    this.handleModuleClick('/system/remote?tab=qorus')
                  }
                >
                  Qorus
                </div>
                <div
                  className="dashboard-data-top"
                  onClick={() =>
                    this.handleModuleClick('/system/remote?tab=qorus')
                  }
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
                      '/system/remote?tab=qorus&search=has_alerts:true'
                    )
                  }
                >
                  <div className="db-data-content">{system.remote_alerts}</div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
              <div className="dashboard-data-module has-link">
                <div
                  className="dashboard-data-title"
                  onClick={() => this.handleModuleClick('/system/remote')}
                >
                  Datasource
                </div>
                <div
                  className="dashboard-data-top"
                  onClick={() => this.handleModuleClick('/system/remote')}
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
                    this.handleModuleClick(
                      '/system/remote?search=has_alerts:true'
                    )
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
                  onClick={() =>
                    this.handleModuleClick('/system/remote?tab=user')
                  }
                >
                  User
                </div>
                <div
                  className="dashboard-data-top"
                  onClick={() =>
                    this.handleModuleClick('/system/remote?tab=user')
                  }
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
                      '/system/remote?tab=user&search=has_alerts:true'
                    )
                  }
                >
                  <div className="db-data-content">{system.user_alerts}</div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
            </PaneItem>
          </DashboardModule>
        </Masonry>
      </div>
    );
  }
}
