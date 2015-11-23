import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';


import { pureRender } from 'components/utils';


import actions from 'store/api/actions';


@pureRender
export default class WorkflowsControls extends Component {
  static propTypes = {
    workflow: PropTypes.object
  }

  static contextTypes = {
    dispatch: PropTypes.func
  }

  dispatchAction(action) {
    this.context.dispatch(
      actions.workflows[action](this.props.workflow)
    );
  }

  render() {
    return (
      <Controls>
        {this.props.workflow.enabled ?
         <Control title='Disable' icon='power-off' labelStyle='success'
                  action={() => this.dispatchAction('disable')} /> : null}
        {!this.props.workflow.enabled ?
         <Control title='Enable' icon='power-off' labelStyle='danger'
                  action={() => this.dispatchAction('enable')} /> : null}
        <Control title='Reset' icon='refresh' labelStyle='warning'
                 action={() => this.dispatchAction('reset')} />
      </Controls>
    );
  }
}
