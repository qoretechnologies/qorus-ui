import React, { Component, PropTypes } from 'react';
import WorkflowControls from '../workflows/controls';
import AutoStart from '../../components/autostart';

import { ORDER_STATES } from '../../constants/orders';

import actions from 'store/api/actions';

export default class extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  setAutostart = (context, value) => {
    this.context.dispatch(
      actions.workflows.setAutostart(context, value)
    );
  };

  renderBadges = () => ORDER_STATES.map(o => (
      this.props.data[o.name] > 0 ?
        <span className="badge alert-danger">{`${o.short}: ${this.props.data[o.name]}`}</span> :
        undefined
    ));

  renderGroups = () => this.props.data.groups.map(g => (
      <span className="label label-info">{`${g.name} (${g.size})`}</span>
    ));

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <h3 className="pull-left">
              {this.props.data.name}
              {' '}
              <small>{this.props.data.version}</small>
            </h3>
            <div className="pull-right">
              <WorkflowControls workflow={this.props.data} />
              <AutoStart
                context={this.props.data}
                autostart={this.props.data.autostart}
                execCount={this.props.data.exec_count}
                inc={this.setAutostart}
                dec={this.setAutostart}
              />
            </div>
          </div>
        </div>
        <div className="row status-row">
          <div className="col-xs-12">
            {this.renderBadges()}
          </div>
        </div>
        <div className="row status-row">
          <div className="col-xs-12">
            {this.renderGroups()}
          </div>
        </div>
      </div>
    );
  }
}
