import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import WorkflowControls from '../workflows/controls';
import AutoStart from '../../components/autostart';
import Badge from '../../components/badge';
import { Group } from '../../components/groups';
import Alert from '../../components/alert';
import Icon from '../../components/icon';
import { ORDER_STATES } from '../../constants/orders';
import actions from 'store/api/actions';

export default class DetailHeader extends Component {
  static propTypes = {
    data: PropTypes.object,
    date: PropTypes.string,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  handleBackClick = (ev) => {
    ev.preventDefault();

    history.go(-1);
  };

  setAutostart = (value) => {
    this.context.dispatch(
      actions.workflows.setAutostart(this.props.data.id, value)
    );
  };

  renderBadges = () => ORDER_STATES.map((o, k) => (
      this.props.data[o.name] > 0 ?
        <Badge
          key={k}
          className={`status-${o.label}`}
          val={`${o.short}: ${this.props.data[o.name]}`}
        /> :
        undefined
    ));

  renderGroups = () => this.props.data.groups.map((g, k) => (
      <Group
        key={k}
        name={g.name}
        size={g.size}
      />
    ));

  render() {
    return (
      <div className="workflow-header">
        <div className="row">
          <div className="col-xs-12">
            <h3 className="detail-title pull-left">
              <a href="#" onClick={this.handleBackClick}>
                <Icon icon="angle-left" />
              </a>
              {' '}
              {this.props.data.name}
              {' '}
              <small>{this.props.data.version}</small>
              {' '}
              <small>({this.props.data.id})</small>
            </h3>
            <div className="pull-right">
              <WorkflowControls
                id={this.props.data.id}
                enabled={this.props.data.enabled}
              />
              <AutoStart
                autostart={this.props.data.autostart}
                execCount={this.props.data.exec_count}
                onIncrementClick={this.setAutostart}
                onDecrementClick={this.setAutostart}
              />
            </div>
          </div>
        </div>
        <div className="row status-row">
          <div className="col-xs-12 states">
            {this.renderBadges()}
          </div>
        </div>
        <div className="row status-row">
          <div className="col-xs-12 groups">
            {this.renderGroups()}
          </div>
        </div>
        { this.props.data.has_alerts && (
          <Alert bsStyle="danger">
            <i className="fa fa-warning" />
            <strong> Warning: </strong> this workflow has alerts raised against it
            that may prevent it from operating properly.
            {' '}
            <Link to={`/workflows?date=${this.props.date}&paneId=${this.props.data.id}`}>
              View alerts ({this.props.data.alerts.length}).
            </Link>
          </Alert>
        )}
      </div>
    );
  }
}
