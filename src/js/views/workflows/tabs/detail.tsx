// @flow
import { ControlGroup, InputGroup } from '@blueprintjs/core';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ActionColumnHeader } from '../../../components/ActionColumn';
import AlertsTab from '../../../components/alerts_table';
import Box from '../../../components/box';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control, Controls as ButtonGroup } from '../../../components/controls';
import Dropdown, {
  Control as DControl,
  Item,
} from '../../../components/dropdown';
import Flex from '../../../components/Flex';
// @ts-expect-error ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/gr... Remove this comment to see the full error message
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
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sla_threshold' does not exist on type 'O... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      actions.workflows.setThreshold,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      workflow.id,
      this.state.slaThreshold
    );
  };

  render() {
    const { workflow, systemOptions } = this.props;
    const { dispositionBand, slaBand } = this.state;

    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    const dispositionStats: ?Object =
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
      workflow.order_stats &&
      buildOrderStatsDisposition(
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
        workflow.order_stats,
        dispositionBand.replace(/ /g, '_')
      );

    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    const slaStats: ?Object =
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
      workflow.order_stats &&
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
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
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                      id={this.props.workflow.id}
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'enabled' does not exist on type 'Object'... Remove this comment to see the full error message
                      enabled={this.props.workflow.enabled}
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'remote' does not exist on type 'Object'.
                      remote={this.props.workflow.remote}
                    />
                  </Td>
                  <Td>
                    <Autostart
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'autostart' does not exist on type 'Objec... Remove this comment to see the full error message
                      autostart={this.props.workflow.autostart}
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'exec_count' does not exist on type 'Obje... Remove this comment to see the full error message
                      execCount={this.props.workflow.exec_count}
                      // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                      id={this.props.workflow.id}
                      withExec
                    />
                  </Td>
                  <Td>
                    <ButtonGroup>
                      // @ts-expect-error ts-migrate(2322) FIXME: Type 'Function' is not assignable to type 'FormEve... Remove this comment to see the full error message
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
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
          {workflow.order_stats && (
            <PaneItem
              title="Order Stats - Disposition (%)"
              label={
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                <Dropdown>
                  // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; small: true; icon: strin... Remove this comment to see the full error message
                  <DControl small icon="time">
                    {dispositionBand}
                  </DControl>
                  <Item
                    title="1 hour band"
                    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                    action={this.handleDispositionBandChange}
                  />
                  <Item
                    title="4 hour band"
                    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                    action={this.handleDispositionBandChange}
                  />
                  <Item
                    title="24 hour band"
                    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'total' does not exist on type 'Object'.
                totalInstances={dispositionStats.total}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                workflowId={workflow.id}
                showPct
                minWidth={25}
              />
            </PaneItem>
          )}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'order_stats' does not exist on type 'Obj... Remove this comment to see the full error message
          {workflow.order_stats && (
            <PaneItem
              title="Order Stats - SLA (%)"
              label={
                // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                <Dropdown>
                  // @ts-expect-error ts-migrate(2739) FIXME: Type '{ children: string; small: true; icon: strin... Remove this comment to see the full error message
                  <DControl small icon="time">
                    {slaBand}
                  </DControl>
                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                  <Item title="1 hour band" action={this.handleSlaBandChange} />
                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                  <Item title="4 hour band" action={this.handleSlaBandChange} />
                  <Item
                    title="24 hour band"
                    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'total' does not exist on type 'Object'.
                totalInstances={slaStats.total}
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
                workflowId={workflow.id}
              />
            </PaneItem>
          )}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type 'Object'.
          <AlertsTab alerts={workflow.alerts} />
          <ProcessSummary model={workflow} type="workflow" />
          <PaneItem
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'intl' does not exist on type '{ workflow... Remove this comment to see the full error message
            title={this.props.intl.formatMessage({ id: 'global.instances' })}
          >
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'TOTAL' does not exist on type 'Object'.
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
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'groups' does not exist on type 'Object'.
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
