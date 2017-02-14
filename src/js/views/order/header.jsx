import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import OrderControls from '../workflow/tabs/list/controls';
import WorkflowControls from '../workflows/controls';
import WorkflowAutostart from '../workflows/autostart';
import Lock from '../workflow/tabs/list/lock';
import Reschedule from '../workflow/tabs/list/modals/schedule';
import Dropdown, { Control, Item } from 'components/dropdown';
import Alert from '../../components/alert';
import { pureRender } from '../../components/utils';
import Icon from '../../components/icon';

@pureRender
export default class OrderHeader extends Component {
  static propTypes = {
    data: PropTypes.object,
    workflow: PropTypes.object,
    username: PropTypes.string,
    linkDate: PropTypes.string,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  handleLockClick = (model) => () => {
    const label = model.operator_lock ? 'Unlock' : 'Lock';

    this._modal = (
      <Lock
        onClose={this.handleModalCloseClick}
        data={model}
        label={label}
        username={this.props.username}
      />
    );

    this.context.openModal(this._modal);
  };

  handleScheduleClick = (order) => {
    this._modal = (
      <Reschedule
        data={order}
        onClose={this.handleModalCloseClick}
      />
    );

    this.context.openModal(this._modal);
  };

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  renderLock() {
    const { data } = this.props;
    const icon = data.operator_lock ? 'lock' : 'unlock';
    const itemIcon = data.operator_lock ? 'unlock' : 'lock';
    const locked = data.operator_lock || '';
    const title = data.operator_lock ? 'Unlock' : 'Lock';
    const style = data.operator_lock ? 'danger' : 'success';
    const disabled = data.operator_lock && data.operator_lock !== this.props.username;

    return (
      <Dropdown>
        <Control
          disabled={disabled}
          small
          btnStyle={style}
        >
          <i className={`fa fa-${icon}`} />
          {' '}
          { locked }
        </Control>
        <Item
          icon={itemIcon}
          title={title}
          action={this.handleLockClick(data)}
        />
      </Dropdown>
    );
  }

  handleBackClick = (ev) => {
    ev.preventDefault();

    history.go(-1);
  };

  renderIcon() {
    if (this.props.workflow.enabled) {
      return (
        <i className="fa fa-check-circle icon-success" />
      );
    }

    return (
      <i className="fa fa-times-circle icon-danger" />
    );
  }

  render() {
    return (
      <div className="order-header">
        <div className="row">
          <div className="col-xs-12">
            <h3 className="detail-title pull-left">
              <a href="#" onClick={this.handleBackClick}>
                <Icon icon="angle-left" />
              </a>
              {' '}
              { this.renderIcon() }
              {' '}
              {this.props.data.name}
              <small>
                {' '}
                {this.props.data.version}
                {' '}
                ({this.props.data.id})
              </small>
            </h3>
            <div className="order-actions pull-right">
              <WorkflowControls
                id={this.props.workflow.id}
                enabled={this.props.workflow.enabled}
              />
              <WorkflowAutostart
                id={this.props.workflow.id}
                autostart={this.props.workflow.autostart}
                execCount={this.props.workflow.exec_count}
              />
              {' '}
              <OrderControls
                id={this.props.data.id}
                workflowstatus={this.props.data.workflowstatus}
              />
              <Lock
                id={this.props.data.id}
                lock={this.props.data.operator_lock}
              />
            </div>
          </div>
        </div>
        { this.props.workflow.has_alerts && (
          <Alert bsStyle="danger">
            <i className="fa fa-warning" />
            <strong> Warning: </strong> the parent workflow has alerts raised against it
            that may prevent it from operating properly.
            {' '}
            <Link to={`/workflows?date=${this.props.linkDate}&paneId=${this.props.workflow.id}`}>
              View alerts ({this.props.workflow.alerts.length}).
            </Link>
          </Alert>
        )}
      </div>
    );
  }
}
