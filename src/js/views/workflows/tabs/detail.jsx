// @flow
import React, { Component, PropTypes } from 'react';
import { Groups, Group } from '../../../components/groups';
import Options from '../../../components/options';
import { connect } from 'react-redux';

import AlertsTab from '../../../components/alerts_table';
import actions from '../../../store/api/actions';
import { ORDER_STATES } from '../../../constants/orders';
import PaneItem from '../../../components/pane_item';

import { Control, Controls as ButtonGroup } from '../../../components/controls';
import WorkflowsControls from '../controls';
import InstancesChart from '../../../components/instances_chart';
import { InputGroup, ControlGroup } from '@blueprintjs/core';
import ProcessSummary from '../../../components/ProcessSummary';
import Autostart from '../autostart';
import withDispatch from '../../../hocomponents/withDispatch';
import InfoHeader from '../../../components/InfoHeader';
import NoDataIf from '../../../components/NoDataIf';
import {
  buildOrderStatsDisposition,
  buildOrderStatsSLA,
} from '../../../helpers/workflows';
import InstancesBar from '../../../components/instances_bar';
import Dropdown, {
  Item,
  Control as DControl,
} from '../../../components/dropdown';
import Flex from '../../../components/Flex';
import Box from '../../../components/box';

@connect(
  null,
  {
    setOptions: actions.workflows.setOptions,
  }
)
@withDispatch()
export default class DetailTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    setOptions: PropTypes.func.isRequired,
    dispatchAction: PropTypes.func.isRequired,
    band: PropTypes.string.isRequired,
  };

  state: {
    slaThreshold: string,
    dispositionBand: string,
    slaBand: string,
  } = {
    slaThreshold: this.props.workflow.sla_threshold,
    dispositionBand: this.props.band,
    slaBand: this.props.band,
  };

  setOption = opt => {
    this.props.setOptions(this.props.workflow, opt.name, opt.value);
  };

  deleteOption = opt => {
    this.setOption(Object.assign({}, opt, { value: '' }));
  };

  handleThresholdChange = event => {
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

  handleSubmit: Function = e => {
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
            <WorkflowsControls
              id={this.props.workflow.id}
              enabled={this.props.workflow.enabled}
              remote={this.props.workflow.remote}
              big
            />
            <Autostart
              autostart={this.props.workflow.autostart}
              execCount={this.props.workflow.exec_count}
              id={this.props.workflow.id}
              withExec
              big
            />
          </PaneItem>
          <PaneItem title="SLA Threshold">
            <ButtonGroup>
              <form onSubmit={this.handleSubmit}>
                <ControlGroup>
                  <InputGroup
                    type="text"
                    value={`${this.state.slaThreshold}`}
                    onChange={this.handleThresholdChange}
                    className="pt-small"
                    style={{ width: '50px' }}
                  />
                  <Control icon="floppy-disk" type="submit" big />
                </ControlGroup>
              </form>
            </ButtonGroup>
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
          <ProcessSummary process={workflow.process} />
          <PaneItem title="Instances">
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
            {(workflow.groups || []).map(g => (
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
