/* @flow */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Controls, Control } from '../../components/controls';
import actions from '../../store/api/actions';

@connect(
  () => ({}),
  {
    enable: actions.workflows.enable,
    disable: actions.workflows.disable,
    reset: actions.workflows.reset,
  }
)
export default class WorkflowsControls extends Component {
  props: {
    workflow: number,
    enable: Function,
    disable: Function,
    reset: Function,
  };

  handleDisableClick: Function = (): void => {
    this.props.disable(this.props.workflow);
  };

  handleEnableClick: Function = (): void => {
    this.props.enable(this.props.workflow);
  };

  handleResetClick: Function = (): void => {
    this.props.reset(this.props.workflow);
  };

  render() {
    return (
      <Controls>
        {this.props.workflow.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            onClick={this.handleDisableClick}
          />
        )}
        {!this.props.workflow.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            onClick={this.handleEnableClick}
          />
        )}
        <Control
          title="Reset"
          icon="refresh"
          btnStyle="warning"
          onClick={this.handleResetClick}
        />
      </Controls>
    );
  }
}
