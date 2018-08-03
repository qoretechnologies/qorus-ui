import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import round from 'lodash/round';
import Masonry from 'react-masonry-layout';
import replace from 'lodash/replace';

import Loader from '../../../components/loader';
import actions from 'store/api/actions';
import DashboardModule from '../../../components/dashboard_module/index';
import DashboardItem from '../../../components/dashboard_module/item';
import DashboardSection from '../../../components/dashboard_module/section';
import Badge from '../../../components/badge';
import Icon from '../../../components/icon';
import PaneItem from '../../../components/pane_item';
import Tabs, { Pane } from '../../../components/tabs';
import { statusHealth, calculateMemory } from '../../../helpers/system';
import ChartComponent from '../../../components/chart';

import { getStatsCount, getStatsPct } from '../../../helpers/chart';
import Dropdown, { Control, Item } from '../../../components/dropdown';

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
  };

  state: {
    chartTab: string,
  } = {
    chartTab: '1 hour band',
  };

  componentWillMount() {
    this.props.dispatch(actions.health.fetch());
  }

  handleChartTabChange: Function = (event: any, chartTab: string): void => {
    console.log(chartTab);

    this.setState({
      chartTab,
    });
  };

  render() {
    if (!this.props.health.sync) return <Loader />;

    const { system, health, width, currentUser } = this.props;
    const clusterMemory = Object.keys(system.cluster_memory).reduce(
      (cur, node: string) => cur + system.cluster_memory[node],
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
                title="Global order stats"
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
                      <div>
                        <ChartComponent
                          title="# of stats"
                          width={150}
                          height={150}
                          isNotTime
                          type="doughnut"
                          empty={stats.l.every(stat => stat.count === 0)}
                          labels={[
                            `Recovered automatically (${
                              stats.l.find(dt => dt.disposition === 'A').pct
                            }%)`,
                            `Recovered manually (${
                              stats.l.find(dt => dt.disposition === 'M').pct
                            }%)`,
                            `Completed w/o errors (${
                              stats.l.find(dt => dt.disposition === 'C').pct
                            }%)`,
                          ]}
                          datasets={[
                            {
                              data: [
                                stats.l.find(dt => dt.disposition === 'A')
                                  .count,
                                stats.l.find(dt => dt.disposition === 'M')
                                  .count,
                                stats.l.find(dt => dt.disposition === 'C')
                                  .count,
                              ],
                              backgroundColor: [
                                '#FFB366',
                                '#FF7373',
                                '#7fba27',
                              ],
                            },
                          ]}
                        />
                        <ChartComponent
                          title="SLA stats"
                          width={150}
                          height={150}
                          isNotTime
                          type="doughnut"
                          empty={stats.sla.length === 0}
                          labels={[
                            `In SLA (${Math.round(getStatsPct(true, stats))}%)`,
                            `Out of SLA (${Math.round(
                              getStatsCount(false, stats)
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
          <DashboardModule titleStyle="green">
            <PaneItem title="Cluster">
              <div className="module-wrapper">
                <div className="dashboard-module-small">
                  <div className="top">{calculateMemory(clusterMemory)}</div>
                  <div className="bottom">Memory</div>
                </div>
                <div className="dashboard-module-small">
                  <div className="top">
                    {Object.keys(system.cluster_memory).length}
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
              {Object.keys(system.cluster_memory).map((node: string) => {
                const memory: string = calculateMemory(
                  system.cluster_memory[node]
                );

                const processName = Object.keys(system.processes).find(
                  process => system.processes[process].node === node
                );

                const processes: number = Object.keys(system.processes).filter(
                  (process: string) => system.processes[process].node === node
                ).length;

                return (
                  <div className="dashboard-module-wide">
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
            <PaneItem title="Interfaces">
              <div className="dashboard-data-module">
                <div className="dashboard-data-title"> Workflows </div>
                <div className="dashboard-data-top">
                  <div className="db-data-content">{system.workflow_total}</div>
                  <div className="db-data-label"> total </div>
                </div>
                <div
                  className={`dashboard-data-bottom ${
                    system.workflow_alerts ? 'has-alerts' : ''
                  }`}
                >
                  <div className="db-data-content">
                    {system.workflow_alerts}
                  </div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
              <div className="dashboard-data-module">
                <div className="dashboard-data-title"> Services </div>
                <div className="dashboard-data-top">
                  <div className="db-data-content">{system.service_total}</div>
                  <div className="db-data-label"> total </div>
                </div>
                <div
                  className={`dashboard-data-bottom ${
                    system.service_alerts ? 'has-alerts' : ''
                  }`}
                >
                  <div className="db-data-content">{system.service_alerts}</div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
              <div className="dashboard-data-module">
                <div className="dashboard-data-title"> Jobs </div>
                <div className="dashboard-data-top">
                  <div className="db-data-content">{system.job_total}</div>
                  <div className="db-data-label"> total </div>
                </div>
                <div
                  className={`dashboard-data-bottom ${
                    system.job_alerts ? 'has-alerts' : ''
                  }`}
                >
                  <div className="db-data-content">{system.job_alerts}</div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
            </PaneItem>
          </DashboardModule>
          <DashboardModule>
            <PaneItem title="Remote instances">
              {health.data.remote &&
                health.data.remote.map((remote: Object) => (
                  <div className="dashboard-module-wide">
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
          <DashboardModule>
            <PaneItem title="System overview">
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
                  }`}
                >
                  <div>{system['alert-summary'].ongoing}</div>
                  <div>ongoing alerts</div>
                </div>
                <div
                  className={`module overview-module ${
                    system['alert-summary'].transient !== 0 ? 'danger' : 'none'
                  }`}
                >
                  <div>{system['alert-summary'].transient}</div>
                  <div>transient alerts</div>
                </div>
              </div>
            </PaneItem>
          </DashboardModule>
          <DashboardModule>
            <PaneItem title="Connections">
              <div className="dashboard-data-module">
                <div className="dashboard-data-title"> Qorus </div>
                <div className="dashboard-data-top">
                  <div className="db-data-content">{system.remote_total}</div>
                  <div className="db-data-label"> total </div>
                </div>
                <div
                  className={`dashboard-data-bottom ${
                    system.remote_alerts ? 'has-alerts' : ''
                  }`}
                >
                  <div className="db-data-content">{system.remote_alerts}</div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
              <div className="dashboard-data-module">
                <div className="dashboard-data-title"> Datasource </div>
                <div className="dashboard-data-top">
                  <div className="db-data-content">
                    {system.datasource_total}
                  </div>
                  <div className="db-data-label"> total </div>
                </div>
                <div
                  className={`dashboard-data-bottom ${
                    system.datasource_alerts ? 'has-alerts' : ''
                  }`}
                >
                  <div className="db-data-content">
                    {system.datasource_alerts}
                  </div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
              <div className="dashboard-data-module">
                <div className="dashboard-data-title"> User </div>
                <div className="dashboard-data-top">
                  <div className="db-data-content">{system.user_total}</div>
                  <div className="db-data-label"> total </div>
                </div>
                <div
                  className={`dashboard-data-bottom ${
                    system.user_alerts ? 'has-alerts' : ''
                  }`}
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
