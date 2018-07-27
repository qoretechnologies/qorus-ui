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
import NoData from '../../../components/nodata';
import Icon from '../../../components/icon';
import PaneItem from '../../../components/pane_item';
import Tabs, { Pane } from '../../../components/tabs';
import { statusHealth } from '../../../helpers/system';
import ChartComponent from '../../../components/chart';
import { CenterWrapper } from '../../../components/layout';
import { getStatsData } from '../../../helpers/chart';

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
    ordersTab: string,
    slaTab: string,
  } = {
    ordersTab: '1 hour band',
    slaTab: '1 hour band',
  };

  componentWillMount() {
    this.props.dispatch(actions.health.fetch());
  }

  handleOrdersTabChange: Function = (ordersTab: string): void => {
    this.setState({
      ordersTab,
    });
  };

  handleSlaTabChange: Function = (slaTab: string): void => {
    this.setState({
      slaTab,
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

    const masonryKey = `${width}_${this.state.ordersTab}_${
      this.state.slaTab
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
              <PaneItem title="Global order stats - number of orders">
                <Tabs
                  active={this.state.ordersTab}
                  noContainer
                  onChange={this.handleOrdersTabChange}
                >
                  {system.order_stats.map(stats => (
                    <Pane name={replace(stats.label, /_/g, ' ')}>
                      {stats.l.length > 0 &&
                      stats.l.every(stat => stat.count !== 0) ? (
                        <CenterWrapper>
                          <ChartComponent
                            width={150}
                            height={150}
                            isNotTime
                            type="doughnut"
                            labels={[
                              'Recovered automatically',
                              'Recovered manually',
                              'Completed w/o errors',
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
                        </CenterWrapper>
                      ) : (
                        <NoData />
                      )}
                    </Pane>
                  ))}
                </Tabs>
              </PaneItem>
            </DashboardModule>
          )}
          {system.order_stats && (
            <DashboardModule>
              <PaneItem title="Global order stats - SLA">
                <Tabs
                  active={this.state.slaTab}
                  noContainer
                  onChange={this.handleSlaTabChange}
                >
                  {system.order_stats.map(stats => (
                    <Pane name={replace(stats.label, /_/g, ' ')}>
                      {stats.sla.length > 0 ? (
                        <CenterWrapper>
                          <ChartComponent
                            width={150}
                            height={150}
                            isNotTime
                            type="doughnut"
                            labels={['In SLA', 'Out of SLA']}
                            datasets={[
                              {
                                data: [
                                  Math.round(getStatsData(true, stats)),
                                  Math.round(getStatsData(false, stats)),
                                ],
                                backgroundColor: ['#7fba27', '#FF7373'],
                              },
                            ]}
                          />
                        </CenterWrapper>
                      ) : (
                        <NoData />
                      )}
                    </Pane>
                  ))}
                </Tabs>
              </PaneItem>
            </DashboardModule>
          )}
          <DashboardModule titleStyle="green">
            <PaneItem title="Cluster">
              <DashboardSection>
                <DashboardItem left>
                  Total Memory:{' '}
                  <Badge
                    val={`${round(clusterMemory * 0.00000095367432, 2)} MiB`}
                    label="info"
                  />{' '}
                  <Icon iconName="circle" className="separator" /> Processes:{' '}
                  <Badge
                    val={Object.keys(system.processes).length}
                    label="info"
                  />{' '}
                  <Icon iconName="circle" className="separator" /> Nodes:{' '}
                  <Badge
                    val={Object.keys(system.cluster_memory).length}
                    label="info"
                  />
                </DashboardItem>
              </DashboardSection>
              {Object.keys(system.cluster_memory).map((node: string) => {
                const memory: string = round(
                  system.cluster_memory[node] * 0.00000095367432,
                  2
                );

                const processName = Object.keys(system.processes).find(
                  process => system.processes[process].node === node
                );

                const processes: number = Object.keys(system.processes).filter(
                  (process: string) => system.processes[process].node === node
                ).length;

                return (
                  <div>
                    <DashboardSection
                      link="/system/cluster"
                      iconName="hdd-o"
                      title={system.processes[processName].host}
                    >
                      {node}
                      <DashboardItem>
                        Memory: <Badge val={`${memory} MiB`} label="info" />{' '}
                        <Icon iconName="circle" className="separator" />
                        Processes: <Badge val={processes} label="info" />
                      </DashboardItem>
                    </DashboardSection>
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
                <div className="dashboard-data-bottom">
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
                <div className="dashboard-data-bottom">
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
                <div className="dashboard-data-bottom">
                  <div className="db-data-content">{system.job_alerts}</div>
                  <div className="db-data-label"> with alerts </div>
                </div>
              </div>
            </PaneItem>
          </DashboardModule>
          <DashboardModule>
            <PaneItem title="System Overview">
              <DashboardSection link="/system/alerts">
                <DashboardItem left>
                  Key:{' '}
                  <Badge
                    val={health.data['instance-key']}
                    label="info"
                    bypass
                  />{' '}
                  <Icon iconName="circle" className="separator" /> Health:{' '}
                  <Badge
                    val={health.data.health}
                    label={statusHealth(health.data.health)}
                    bypass
                  />
                  <Icon iconName="circle" className="separator" /> Alerts:{' '}
                  <Badge
                    val={`${system['alert-summary'].ongoing} ongoing`}
                    label="danger"
                    bypass
                  />{' '}
                  /{' '}
                  <Badge
                    val={`${system['alert-summary'].transient} transient`}
                    label="danger"
                    bypass
                  />
                </DashboardItem>
              </DashboardSection>
              {health.data.remote &&
                health.data.remote.map((remote: Object) => (
                  <div>
                    <DashboardSection
                      iconName="external-link"
                      link={remote.url}
                    >
                      {remote.name}{' '}
                      <Icon iconName="circle" className="separator" /> key /
                      status
                      <DashboardItem>
                        <Badge
                          val={remote['instance-key']}
                          label="info"
                          bypass
                        />{' '}
                        /{' '}
                        <Badge
                          val={remote.health}
                          label={statusHealth(remote.health)}
                          bypass
                        />
                      </DashboardItem>
                    </DashboardSection>
                  </div>
                ))}
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
                <div className="dashboard-data-bottom">
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
                <div className="dashboard-data-bottom">
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
                <div className="dashboard-data-bottom">
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
