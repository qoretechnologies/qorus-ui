import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import AutoStart from '../../../components/autostart';
import WorkflowsControls from '../controls';

import actions from 'store/api/actions';

@connect(
  () => ({}),
  {
    setAutostart: actions.workflows.setAutostart,
  }
)
export default class WorkflowsHeader extends Component {
  static propTypes = {
    workflow: PropTypes.object,
    setAutostart: PropTypes.func,
  };

  handleAutostartChange = (value) => {
    this.props.setAutostart(this.props.workflow.id, value);
  };

  render() {
    return (
      <div className="row pane__header">
        <div className="col-xs-12">
          <h3 className="pull-left">
            <span className="selectable">
              {this.props.workflow.normalizedName}
            </span>
          </h3>
        </div>
        <div className="col-xs-12 pane__controls">
          <WorkflowsControls
            id={this.props.workflow.id}
            enabled={this.props.workflow.enabled}
          />
          {' '}
          <AutoStart
            autostart={this.props.workflow.autostart}
            execCount={this.props.workflow.exec_count}
            onIncrementClick={this.handleAutostartChange}
            onDecrementClick={this.handleAutostartChange}
          />
        </div>
      </div>
    );
  }
}
