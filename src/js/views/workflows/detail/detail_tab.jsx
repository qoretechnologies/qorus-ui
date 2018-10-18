import React, { Component, PropTypes } from 'react';
import { Groups, Group } from 'components/groups';
import Options from '../../../components/options';
import { connect } from 'react-redux';

import AlertsTab from '../../../components/alerts_table';
import Author from '../../../components/author';
import Icon from '../../../components/icon';
import Badge from '../../../components/badge';
import actions from 'store/api/actions';
import { ORDER_STATES } from '../../../constants/orders';
import PaneItem from '../../../components/pane_item';

import { Control } from '../../../components/controls';
import WorkflowsControls from '../controls';
import InstancesChart from '../../../components/instances_chart';
import { InputGroup, ControlGroup } from '@blueprintjs/core';
import ProcessSummary from '../../../components/ProcessSummary';
import Autostart from '../autostart';
import withDispatch from '../../../hocomponents/withDispatch';

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
  };

  state: {
    slaThreshold: string,
  } = {
    slaThreshold: this.props.workflow.sla_threshold,
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

    return (
      <div>
        <PaneItem title="Controls">
          <div className="pane__controls">
            <WorkflowsControls
              id={this.props.workflow.id}
              enabled={this.props.workflow.enabled}
              remote={this.props.workflow.remote}
            />{' '}
            <Autostart
              autostart={this.props.workflow.autostart}
              execCount={this.props.workflow.exec_count}
              id={this.props.workflow.id}
              withExec
            />
          </div>
        </PaneItem>
        <PaneItem title="SLA Threshold">
          <form onSubmit={this.handleSubmit}>
            <ControlGroup>
              <InputGroup
                type="text"
                value={`${this.state.slaThreshold}`}
                onChange={this.handleThresholdChange}
              />
              <Control icon="floppy-disk" type="submit" big />
            </ControlGroup>
          </form>
        </PaneItem>
        {workflow.description && (
          <PaneItem title="Description">
            <p>{workflow.description}</p>
          </PaneItem>
        )}
        <Author model={workflow} />
        <AlertsTab alerts={workflow.alerts} />
        <ProcessSummary process={workflow.process} />
        <PaneItem title="Instances">
          <InstancesChart
            width="100%"
            states={ORDER_STATES}
            instances={workflow}
          />
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
      </div>
    );
  }
}
