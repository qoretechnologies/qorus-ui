import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Callout, Intent } from '@blueprintjs/core';

import OrderControls from '../workflow/tabs/list/controls';
import WorkflowControls from '../workflows/controls';
import WorkflowAutostart from '../workflows/autostart';
import Lock from '../workflow/tabs/list/lock';
import Reschedule from '../workflow/tabs/list/modals/schedule';
import Dropdown, { Control, Item } from 'components/dropdown';
import Alert from '../../components/alert';
import { pureRender } from '../../components/utils';
import Icon from '../../components/icon';
import queryControl from '../../hocomponents/queryControl';
import { Breadcrumbs, Crumb } from '../../components/breadcrumbs';

@pureRender
@queryControl('target')
@queryControl('prevQuery')
export default class OrderHeader extends Component {
  static propTypes = {
    data: PropTypes.object,
    workflow: PropTypes.object,
    username: PropTypes.string,
    linkDate: PropTypes.string,
    targetQuery: PropTypes.string,
    prevQueryQuery: PropTypes.string,
  };

  static contextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };

  handleLockClick = model => () => {
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

  handleScheduleClick = order => {
    this._modal = (
      <Reschedule data={order} onClose={this.handleModalCloseClick} />
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
    const disabled =
      data.operator_lock && data.operator_lock !== this.props.username;

    return (
      <Dropdown>
        <Control disabled={disabled} small btnStyle={style}>
          <i className={`fa fa-${icon}`} /> {locked}
        </Control>
        <Item
          icon={itemIcon}
          title={title}
          action={this.handleLockClick(data)}
        />
      </Dropdown>
    );
  }

  handleBackClick = ev => {
    ev.preventDefault();

    history.go(-1);
  };

  renderIcon() {
    if (this.props.workflow.enabled) {
      return <i className="fa fa-check-circle icon-success" />;
    }

    return <i className="fa fa-times-circle icon-danger" />;
  }

  render() {
    const { prevQueryQuery, targetQuery, workflow } = this.props;
    const target = targetQuery || `/workflow/${workflow.id}/list`;

    const backQueriesObj = prevQueryQuery
      ? JSON.parse(JSON.parse(this.props.prevQueryQuery))
      : {};
    const backQueriesStr = Object.keys(backQueriesObj).reduce(
      (cur, next, index) => {
        const last = index === Object.keys(backQueriesObj).length - 1;

        return `${cur}${next}=${backQueriesObj[next]}${last ? '' : '&'}`;
      },
      `${target}?`
    );

    return (
      <div className="order-header">
        <Breadcrumbs>
          <Crumb link="/workflows">Workflows</Crumb>
          <Crumb link={backQueriesStr}>
            {this.props.data.name}
            <small>
              {' '}
              v{this.props.workflow.version} ({this.props.workflow.id})
            </small>
          </Crumb>
          <Crumb>
            {this.renderIcon()} ORDER{' '}
            <small>
              {this.props.data.id} v{this.props.data.version}
            </small>
          </Crumb>
        </Breadcrumbs>
        <div className="order-actions pull-right">
          <WorkflowControls
            id={this.props.workflow.id}
            enabled={this.props.workflow.enabled}
          />
          <WorkflowAutostart
            id={this.props.workflow.id}
            autostart={this.props.workflow.autostart}
            execCount={this.props.workflow.exec_count}
            withExec
          />{' '}
          <OrderControls
            id={this.props.data.id}
            workflowstatus={this.props.data.workflowstatus}
          />
          <Lock id={this.props.data.id} lock={this.props.data.operator_lock} />
        </div>
        {this.props.workflow.has_alerts && (
          <Callout
            intent={Intent.DANGER}
            icon="warning-sign"
            title="Workflow with alerts"
          >
            the parent workflow has alerts raised against it that may prevent it
            from operating properly.{' '}
            <Link
              to={`/workflows?date=${this.props.linkDate}&paneId=${
                this.props.workflow.id
              }`}
            >
              View alerts ({this.props.workflow.alerts.length}).
            </Link>
          </Callout>
        )}
      </div>
    );
  }
}
