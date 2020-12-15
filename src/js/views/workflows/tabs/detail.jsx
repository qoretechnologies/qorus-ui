// @flow
import { ControlGroup, InputGroup } from '@blueprintjs/core';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ActionColumnHeader } from '../../../components/ActionColumn';
import AlertsTab from '../../../components/alerts_table';
import Box from '../../../components/box';
import { Control, Controls as ButtonGroup } from '../../../components/controls';
import Dropdown, {
  Control as DControl,
  Item,
} from '../../../components/dropdown';
import Flex from '../../../components/Flex';
import { Group, Groups } from '../../../components/groups';
import InfoHeader from '../../../components/InfoHeader';
import InstancesBar from '../../../components/instances_bar';
import InstancesChart from '../../../components/instances_chart';
import { Table, Tbody, Td, Th, Thead, Tr } from '../../../components/new_table';
import NoDataIf from '../../../components/NoDataIf';
import Options from '../../../components/options';
import PaneItem from '../../../components/pane_item';
import ProcessSummary from '../../../components/ProcessSummary';
import { ORDER_STATES } from '../../../constants/orders';
import {
  buildOrderStatsDisposition,
  buildOrderStatsSLA,
} from '../../../helpers/workflows';
import withDispatch from '../../../hocomponents/withDispatch';
import actions from '../../../store/api/actions';
import Autostart from '../autostart';
import WorkflowsControls from '../controls';

@connect(null, {
  setOptions: actions.workflows.setOptions,
})
@withDispatch()
@injectIntl
export default class DetailTab extends Component {
  props: {
    workflow: Object,
    systemOptions: Array<Object>,
    setOptions: Function,
    dispatchAction: Function,
    band: string,
  } = this.props;

  state: {
    slaThreshold: string,
    dispositionBand: string,
    slaBand: string,
  } = {
    slaThreshold: this.props.workflow.sla_threshold,
    dispositionBand: this.props.band,
    slaBand: this.props.band,
  };

  setOption = (opt) => {
    this.props.setOptions(this.props.workflow, opt.name, opt.value);
  };

  deleteOption = (opt) => {
    this.setOption(Object.assign({}, opt, { value: '' }));
  };

  handleThresholdChange = (event) => {
    this.setState({ slaThreshold: event.target.value });
  };

  handleDispositionBandChange: Function = (
    event: Object,
    dispositionBand: string
  ): void => {
    this.setState({ dispositionBand });
  };

  handleSlaBandChange: Function = (event: Object, slaBand: string): void => {
    this.setState({ slaBand });
  };

  handleSubmit: Function = (e) => {
    e.preventDefault();

    const { dispatchAction, workflow } = this.props;

    dispatchAction(
      actions.workflows.setThreshold,
      workflow.id,
      this.state.slaThreshold
    );
  };

  render() {
    const { workflow, systemOptions } = this.props;
    const { dispositionBand, slaBand } = this.state;

    const dispositionStats: ?Object =
      workflow.order_stats &&
      buildOrderStatsDisposition(
        workflow.order_stats,
        dispositionBand.replace(/ /g, '_')
      );

    const slaStats: ?Object =
      workflow.order_stats &&
      buildOrderStatsSLA(workflow.order_stats, slaBand.replace(/ /g, '_'));

    return (
      <Box top fill>
        <InfoHeader model={workflow} />
        <Flex scrollY>
          <PaneItem title="Controls">
            <Table condensed bordered width="auto">
              <Thead>
                <Tr>
                  <ActionColumnHeader />
                  <Th icon="automatic-updates">Auto/Execs</Th>
                  <Th icon="time">SLA Threshold</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <WorkflowsControls
                      id={this.props.workflow.id}
                      enabled={this.props.workflow.enabled}
                      remote={this.props.workflow.remote}
                    />
                  </Td>
                  <Td>
                    <Autostart
                      autostart={this.props.workflow.autostart}
                      execCount={this.props.workflow.exec_count}
                      id={this.props.workflow.id}
                      withExec
                    />
                  </Td>
                  <Td>
                    <ButtonGroup>
                      <form onSubmit={this.handleSubmit}>
                        <ControlGroup>
                          <InputGroup
                            type="text"
                            value={`${this.state.slaThreshold}`}
                            onChange={this.handleThresholdChange}
                            className="bp3-small"
                          />
                          <Control icon="floppy-disk" type="submit" />
                        </ControlGroup>
                      </form>
                    </ButtonGroup>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </PaneItem>
          {workflow.order_stats && (
            <PaneItem
              title="Order Stats - Disposition (%)"
              label={
                <Dropdown>
                  <DControl small icon="time">
                    {dispositionBand}
                  </DControl>
                  <Item
                    title="1 hour band"
                    action={this.handleDispositionBandChange}
                  />
                  <Item
                    title="4 hour band"
                    action={this.handleDispositionBandChange}
                  />
                  <Item
                    title="24 hour band"
                    action={this.handleDispositionBandChange}
                  />
                </Dropdown>
              }
            >
              <InstancesBar
                states={[
                  { name: 'completed', label: 'complete' },
                  { name: 'automatically', label: 'automatic' },
                  { name: 'manually', label: 'error' },
                ]}
                instances={dispositionStats}
                totalInstances={dispositionStats.total}
                workflowId={workflow.id}
                showPct
                minWidth={25}
              />
            </PaneItem>
          )}
          {workflow.order_stats && (
            <PaneItem
              title="Order Stats - SLA (%)"
              label={
                <Dropdown>
                  <DControl small icon="time">
                    {slaBand}
                  </DControl>
                  <Item title="1 hour band" action={this.handleSlaBandChange} />
                  <Item title="4 hour band" action={this.handleSlaBandChange} />
                  <Item
                    title="24 hour band"
                    action={this.handleSlaBandChange}
                  />
                </Dropdown>
              }
            >
              <InstancesBar
                states={[
                  { name: 'In SLA', label: 'complete' },
                  { name: 'Out of SLA', label: 'error' },
                ]}
                showPct
                minWidth={25}
                instances={slaStats}
                totalInstances={slaStats.total}
                workflowId={workflow.id}
              />
            </PaneItem>
          )}
          <AlertsTab alerts={workflow.alerts} />
          <ProcessSummary model={workflow} type="workflow" />
          <PaneItem
            title={this.props.intl.formatMessage({ id: 'global.instances' })}
          >
            <NoDataIf condition={workflow.TOTAL === 0}>
              {() => (
                <InstancesChart
                  width="100%"
                  states={ORDER_STATES}
                  instances={workflow}
                />
              )}
            </NoDataIf>
          </PaneItem>
          <Groups>
            {(workflow.groups || []).map((g) => (
              <Group
                key={g.name}
                name={g.name}
                url={`/groups?group=${g.name}`}
                size={g.size}
                disabled={!g.enabled}
              />
            ))}
          </Groups>
          <Options
            model={workflow}
            systemOptions={systemOptions}
            onSet={this.setOption}
            onDelete={this.deleteOption}
          />
        </Flex>
      </Box>
    );
  }
}
