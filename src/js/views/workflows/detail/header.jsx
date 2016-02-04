import React, { Component, PropTypes } from 'react';
import AutoStart from 'components/autostart';
import WorkflowsControls from '../controls';


import { pureRender } from 'components/utils';


import actions from 'store/api/actions';


@pureRender
export default class WorkflowsHeader extends Component {
  static propTypes = {
    workflow: PropTypes.object,
  };


  static contextTypes = {
    dispatch: PropTypes.func.isRequired,
  };


  setAutostart(context, value) {
    this.context.dispatch(
      actions.workflows.setAutostart(context, value)
    );
  }


  render() {
    return (
      <div className="row wflw__header">
        <div className="col-xs-12">
          <h3 className="pull-left">
            <span className="selectable">
              {this.props.workflow.normalizedName}
            </span>
          </h3>
        </div>
        <div className="col-xs-12 wflw__controls">
          <WorkflowsControls workflow={this.props.workflow} />
          {' '}
          <AutoStart
            context={this.props.workflow}
            autostart={this.props.workflow.autostart}
            execCount={this.props.workflow.exec_count}
            inc={::this.setAutostart}
            dec={::this.setAutostart}
          />
        </div>
      </div>
    );
  }
}
