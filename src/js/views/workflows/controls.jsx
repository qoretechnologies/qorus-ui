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


  render() {
    const dispatchDisable = () => this.dispatchAction('disable');
    const dispatchEnable = () => this.dispatchAction('enable');
    const dispatchReset = () => this.dispatchAction('reset');

    return (
      <Controls>
        {this.props.workflow.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={dispatchDisable}
          />
        )}
        {!this.props.workflow.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={dispatchEnable}
          />
        )}
        <Control
          title="Reset"
          icon="refresh"
          btnStyle="warning"
          action={dispatchReset}
        />
      </Controls>
    );
  }
}
