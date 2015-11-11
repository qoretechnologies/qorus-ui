import React, { Component, PropTypes } from 'react';
import AutoStart from 'components/autostart';
import { Controls, Control } from 'components/controls';


import { pureRender } from 'components/utils';


import actions from 'store/api/actions';


function setAutostart(id, value) {
  return actions.workflows.action({
    body: JSON.stringify({
      action: 'setAutostart',
      autostart: value,
      // XXX This value will update state and is ignored by Workflow REST API
      exec_count: value
    })
  }, id);
}


@pureRender
export default class WorkflowsHeader extends Component {
  static propTypes = {
    workflow: PropTypes.object
  }

  static contextTypes = {
    dispatch: PropTypes.func
  }

  render() {
    const { dispatch } = this.context;
    const { workflow } = this.props;

    return (
      <div className='row'>
        <div className='col-xs-12'>
          <h3 className='pull-left'>
            <span className='selectable'>{ workflow.name }</span>
            { ' ' }
            <small>{ workflow.version }</small>
          </h3>
        </div>
        <div className='controls col-xs-12'>
          <Controls>
            <Control title='Disable' icon='power-off' labelStyle='success' />
            <Control title='Reset' icon='refresh' labelStyle='warning' />
          </Controls>
          { ' ' }
          <AutoStart
            id={ workflow.id }
            autostart={ workflow.autostart }
            execCount={ workflow.exec_count }
            inc={ (id, value) => dispatch(setAutostart(id, value)) }
            dec={ (id, value) => dispatch(setAutostart(id, value)) } />
        </div>
      </div>
    );
  }
}
