import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import OrderControls from '../workflow/tabs/list/controls';
import Lock from '../workflow/tabs/list/modals/lock';
import Reschedule from '../workflow/tabs/list/modals/reschedule';
import Dropdown, { Control, Item } from 'components/dropdown';

import { pureRender } from 'components/utils';

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
      <div className="row order-header">
        <div className="col-xs-12">
          <h3 className="detail-title pull-left">
            <Link
              to={`/workflow/${this.props.data.workflowid}/list/All/${this.props.linkDate}`}
            >
              <i className="fa fa-angle-left" />
            </Link>
            {' '}
            { this.renderIcon() }
            {' '}
            {this.props.data.name}
            <small>
              {' '}
              {this.props.data.version}
              {' '}
              {`ID#${this.props.data.id}`}
            </small>
          </h3>
          <div className="order-actions pull-right">
            <OrderControls
              data={this.props.data}
              onScheduleClick={this.handleScheduleClick}
              showText
            />
            { this.renderLock() }
          </div>
        </div>
      </div>
    );
  }
}
