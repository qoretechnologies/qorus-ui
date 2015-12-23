import React, { Component, PropTypes } from 'react';
import AutoStart from 'components/autostart';
import WorkflowsControls from '../controls';


import { pureRender } from 'components/utils';


import actions from 'store/api/actions';


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
      <div className='heading'>
        <div className='row'>
          <div className='col-xs-12'>
            <h3 className='pull-left'>
              <span className='selectable'>{workflow.normalizedName}</span>
            </h3>
          </div>
          <div className='controls col-xs-12'>
            <WorkflowsControls workflow={workflow} />
            {' '}
            <AutoStart
              context={workflow}
              autostart={workflow.autostart}
              execCount={workflow.exec_count}
              inc={(context, value) => {
                dispatch(actions.workflows.setAutostart(context, value));
              }}
              dec={(context, value) => {
                dispatch(actions.workflows.setAutostart(context, value));
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
