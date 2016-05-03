import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';

import { pureRender } from 'components/utils';

import actions from 'store/api/actions';

@pureRender
export default class WorkflowsControls extends Component {
  static propTypes = {
    workflow: PropTypes.object,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  dispatchAction(action) {
    this.context.dispatch(
      actions.workflows[action](this.props.workflow)
    );
  }

  dispatchDisable = () => this.dispatchAction('disable')
  dispatchEnable = () => this.dispatchAction('enable')
  dispatchReset = () => this.dispatchAction('reset')

  render() {
    return (
      <Controls>
        {this.props.workflow.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={this.dispatchDisable}
          />
        )}
        {!this.props.workflow.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={this.dispatchEnable}
          />
        )}
        <Control
          title="Reset"
          icon="refresh"
          btnStyle="warning"
          action={this.dispatchReset}
        />
      </Controls>
    );
  }
}
