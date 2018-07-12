import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import round from 'lodash/round';
import Masonry from 'react-masonry-layout';

import Loader from '../../../components/loader';
import Container from '../../../components/container';
import actions from 'store/api/actions';
import DashboardModule from '../../../components/dashboard_module/index';
import DashboardItem from '../../../components/dashboard_module/item';
import DashboardSection from '../../../components/dashboard_module/section';
import Badge from '../../../components/badge';
import Icon from '../../../components/icon';
import PaneItem from '../../../components/pane_item';
import Tabs, { Pane } from '../../../components/tabs';
import { statusHealth } from '../../../helpers/system';
import ChartComponent from '../../../components/chart';
import { CenterWrapper } from '../../../components/layout';

const viewSelector = createSelector(
  [state => state.api.health, state => state.api.system, state => state.ui],
  (health, system, ui) => ({
    health,
    system: system.data,
    width: ui.settings.width,
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
  };

  componentWillMount() {
    this.props.dispatch(actions.health.fetch());
  }

  render() {
    if (!this.props.health.sync) return <Loader />;

    const { system, health, width } = this.props;
    const clusterMemory = Object.keys(system.cluster_memory).reduce(
      (cur, node: string) => cur + system.cluster_memory[node],
      0
    );

    return (
      <div className="tab-pane active">
        <Masonry
          id="dashboard-masonry"
          sizes={[{ columns: 2, gutter: 20 }]}
          style={{ margin: '0 auto' }}
          infiniteScrollDisabled
          key={width}
        >
          <DashboardModule titleStyle="green">
            <PaneItem title="Cluster">
              <DashboardSection>
                <DashboardItem left>
                  Total Memory:{' '}
                  <Badge
                    val={`${round(clusterMemory * 0.00000095367432, 2)} MiB`}
                    label="info"
                  />{' '}
                  <Icon icon="circle" className="separator" /> Processes:{' '}
                  <Badge
                    val={Object.keys(system.processes).length}
                    label="info"
                  />{' '}
                  <Icon icon="circle" className="separator" /> Nodes:{' '}
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
                      icon="hdd-o"
                      title={system.processes[processName].host}
                    >
                      {node}
                      <DashboardItem>
                        Memory: <Badge val={`${memory} MiB`} label="info" />{' '}
                        <Icon icon="circle" className="separator" />
                        Processes: <Badge val={processes} label="info" />
                      </DashboardItem>
                    </DashboardSection>
                  </div>
                );
              })}
            </PaneItem>
          </DashboardModule>
          <DashboardModule>
            <PaneItem title="Intefaces">
              <DashboardSection link="/workflows" icon="sitemap">
                Workflows <Icon icon="circle" className="separator" /> total /
                alerts
                <DashboardItem>
                  <Badge val={system.workflow_total} label="info" bypass /> /{' '}
                  <Badge val={system.workflow_alerts} label="danger" bypass />
                </DashboardItem>
              </DashboardSection>
              <DashboardSection link="/services" icon="list">
                Services <Icon icon="circle" className="separator" /> total /
                alerts
                <DashboardItem>
                  <Badge val={system.service_total} label="info" bypass /> /{' '}
                  <Badge val={system.service_alerts} label="danger" bypass />
                </DashboardItem>
              </DashboardSection>
              <DashboardSection link="/jobs" icon="calendar-o">
                Jobs <Icon icon="circle" className="separator" /> total / alerts
                <DashboardItem>
                  <Badge val={system.job_total} label="info" bypass /> /{' '}
                  <Badge val={system.job_alerts} label="danger" bypass />
                </DashboardItem>
              </DashboardSection>
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
                  <Icon icon="circle" className="separator" /> Health:{' '}
                  <Badge
                    val={health.data.health}
                    label={statusHealth(health.data.health)}
                    bypass
                  />
                  <Icon icon="circle" className="separator" /> Alerts:{' '}
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
                    <DashboardSection icon="external-link" link={remote.url}>
                      {remote.name} <Icon icon="circle" className="separator" />{' '}
                      key / status
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
              <DashboardSection
                link="/system/remote/qorus"
                icon="external-link"
              >
                Qorus <Icon icon="circle" className="separator" /> total /
                alerts
                <DashboardItem>
                  <Badge val={system.remote_total} label="info" bypass /> /{' '}
                  <Badge val={system.remote_alerts} label="danger" bypass />
                </DashboardItem>
              </DashboardSection>
              <DashboardSection link="/system/remote" icon="database">
                Datasource <Icon icon="circle" className="separator" /> total /
                alerts
                <DashboardItem>
                  <Badge val={system.datasource_total} label="info" bypass /> /{' '}
                  <Badge val={system.datasource_alerts} label="danger" bypass />
                </DashboardItem>
              </DashboardSection>
              <DashboardSection link="/system/remote/user" icon="users">
                Users <Icon icon="circle" className="separator" /> total /
                alerts
                <DashboardItem>
                  <Badge val={system.user_total} label="info" bypass /> /{' '}
                  <Badge val={system.user_alerts} label="danger" bypass />
                </DashboardItem>
              </DashboardSection>
            </PaneItem>
          </DashboardModule>
          <DashboardModule>
            <PaneItem title="Global order stats - number of orders">
              <Tabs active="1 hour band" noContainer>
                <Pane name="1 hour band">
                  <CenterWrapper>
                    <ChartComponent
                      width={190}
                      height={190}
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
                            system.order_stats[0].l.find(
                              dt => dt.disposition === 'A'
                            ).count,
                            system.order_stats[0].l.find(
                              dt => dt.disposition === 'M'
                            ).count,
                            system.order_stats[0].l.find(
                              dt => dt.disposition === 'C'
                            ).count,
                          ],
                          backgroundColor: ['#FFB366', '#FF7373', '#7fba27'],
                        },
                      ]}
                    />
                  </CenterWrapper>
                </Pane>
                <Pane name="4 hour band">
                  <CenterWrapper>
                    <ChartComponent
                      width={190}
                      height={190}
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
                            system.order_stats[1].l.find(
                              dt => dt.disposition === 'A'
                            ).count,
                            system.order_stats[1].l.find(
                              dt => dt.disposition === 'M'
                            ).count,
                            system.order_stats[1].l.find(
                              dt => dt.disposition === 'C'
                            ).count,
                          ],
                          backgroundColor: ['#FFB366', '#FF7373', '#7fba27'],
                        },
                      ]}
                    />
                  </CenterWrapper>
                </Pane>
                <Pane name="24 hour band">
                  <CenterWrapper>
                    <ChartComponent
                      width={190}
                      height={190}
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
                            system.order_stats[2].l.find(
                              dt => dt.disposition === 'A'
                            ).count,
                            system.order_stats[2].l.find(
                              dt => dt.disposition === 'M'
                            ).count,
                            system.order_stats[2].l.find(
                              dt => dt.disposition === 'C'
                            ).count,
                          ],
                          backgroundColor: ['#FFB366', '#FF7373', '#7fba27'],
                        },
                      ]}
                    />
                  </CenterWrapper>
                </Pane>
              </Tabs>
            </PaneItem>
          </DashboardModule>
          <DashboardModule>
            <PaneItem title="Global order stats - percentage">
              <Tabs active="1 hour band" noContainer>
                <Pane name="1 hour band">
                  <CenterWrapper>
                    <ChartComponent
                      width={190}
                      height={190}
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
                            Math.round(
                              system.order_stats[0].l.find(
                                dt => dt.disposition === 'A'
                              ).pct
                            ),
                            Math.round(
                              system.order_stats[0].l.find(
                                dt => dt.disposition === 'M'
                              ).pct
                            ),
                            Math.round(
                              system.order_stats[0].l.find(
                                dt => dt.disposition === 'C'
                              ).pct
                            ),
                          ],
                          backgroundColor: ['#FFB366', '#FF7373', '#7fba27'],
                        },
                      ]}
                    />
                  </CenterWrapper>
                </Pane>
                <Pane name="4 hour band">
                  <CenterWrapper>
                    <ChartComponent
                      width={190}
                      height={190}
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
                            Math.round(
                              system.order_stats[1].l.find(
                                dt => dt.disposition === 'A'
                              ).pct
                            ),
                            Math.round(
                              system.order_stats[1].l.find(
                                dt => dt.disposition === 'M'
                              ).pct
                            ),
                            Math.round(
                              system.order_stats[1].l.find(
                                dt => dt.disposition === 'C'
                              ).pct
                            ),
                          ],
                          backgroundColor: ['#FFB366', '#FF7373', '#7fba27'],
                        },
                      ]}
                    />
                  </CenterWrapper>
                </Pane>
                <Pane name="24 hour band">
                  <CenterWrapper>
                    <ChartComponent
                      width={190}
                      height={190}
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
                            Math.round(
                              system.order_stats[2].l.find(
                                dt => dt.disposition === 'A'
                              ).pct
                            ),
                            Math.round(
                              system.order_stats[2].l.find(
                                dt => dt.disposition === 'M'
                              ).pct
                            ),
                            Math.round(
                              system.order_stats[2].l.find(
                                dt => dt.disposition === 'C'
                              ).pct
                            ),
                          ],
                          backgroundColor: ['#FFB366', '#FF7373', '#7fba27'],
                        },
                      ]}
                    />
                  </CenterWrapper>
                </Pane>
              </Tabs>
            </PaneItem>
          </DashboardModule>
        </Masonry>
      </div>
    );
  }
}
