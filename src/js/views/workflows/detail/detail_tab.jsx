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

import AutoStart from '../../../components/autostart';
import WorkflowsControls from '../controls';

@connect(
  null,
  {
    setOptions: actions.workflows.setOptions,
    setAutostart: actions.workflows.setAutostart,
  }
)
export default class DetailTab extends Component {
  static propTypes = {
    workflow: PropTypes.object.isRequired,
    systemOptions: PropTypes.array.isRequired,
    setOptions: PropTypes.func.isRequired,
    setAutostart: PropTypes.func.isRequired,
  };

  setOption = opt => {
    this.props.setOptions(this.props.workflow, opt.name, opt.value);
  };

  deleteOption = opt => {
    this.setOption(Object.assign({}, opt, { value: '' }));
  };

  handleAutostartChange = value => {
    this.props.setAutostart(this.props.workflow.id, value);
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
            />{' '}
            <AutoStart
              autostart={this.props.workflow.autostart}
              execCount={this.props.workflow.exec_count}
              onIncrementClick={this.handleAutostartChange}
              onDecrementClick={this.handleAutostartChange}
            />
          </div>
        </PaneItem>
        <PaneItem title="SLA Threshold">{workflow.sla_threshold}s</PaneItem>
        <PaneItem title="Description">
          <p>{workflow.description}</p>
        </PaneItem>
        <Author model={workflow} />
        <AlertsTab alerts={workflow.alerts} />
        {workflow.process && (
          <div>
            <h4>Process summary</h4>
            Node: <Badge val={workflow.process.node} bypass label="info" />{' '}
            <Icon iconName="circle" className="separator" /> PID:{' '}
            <Badge val={workflow.process.pid} bypass label="info" />{' '}
            <Icon iconName="circle" className="separator" /> Status:{' '}
            <Badge val={workflow.process.status} bypass label="info" />{' '}
            <Icon iconName="circle" className="separator" /> Memory:{' '}
            <Badge val={workflow.process.priv_str} bypass label="info" />
          </div>
        )}
        <PaneItem title="Instances">
          {ORDER_STATES.map((o, k) => (
            <Badge
              key={k}
              className={`status-${o.label}`}
              val={`${o.short}: ${workflow[o.name]}`}
            />
          ))}
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
