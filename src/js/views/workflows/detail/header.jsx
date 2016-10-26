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

  setAutostart = (context, value) => {
    this.props.setAutostart(context, value);
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
          <WorkflowsControls workflow={this.props.workflow} />
          {' '}
          <AutoStart
            context={this.props.workflow}
            autostart={this.props.workflow.autostart}
            execCount={this.props.workflow.exec_count}
            inc={this.setAutostart}
            dec={this.setAutostart}
          />
        </div>
      </div>
    );
  }
}
