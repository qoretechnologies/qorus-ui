import React, { Component, PropTypes } from 'react';
import size from 'lodash/size';

import OrderControls from '../workflow/tabs/list/controls';
import WorkflowControls from '../workflows/controls';
import WorkflowAutostart from '../workflows/autostart';
import Lock from '../workflow/tabs/list/lock';
import Reschedule from '../workflow/tabs/list/modals/schedule';
import Dropdown, { Control, Item } from 'components/dropdown';
import queryControl from '../../hocomponents/queryControl';
import {
  Breadcrumbs,
  Crumb,
  CrumbTabs,
  CollapsedCrumb,
} from '../../components/breadcrumbs';
import Headbar from '../../components/Headbar';
import Pull from '../../components/Pull';
import { normalizeName } from '../../components/utils';

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
          iconName={itemIcon}
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

  render() {
    const { prevQueryQuery, targetQuery, workflow, data } = this.props;
    const target = targetQuery || `/workflow/${workflow.id}?tab=orders`;

    const backQueriesObj = prevQueryQuery
      ? JSON.parse(JSON.parse(this.props.prevQueryQuery))
      : {};
    const backQueriesStr = Object.keys(backQueriesObj).reduce(
      (cur, next, index) => {
        const last = index === Object.keys(backQueriesObj).length - 1;

        return `${cur}${next}=${backQueriesObj[next]}${last ? '' : '&'}`;
      },
      `${target}&`
    );

    const workflowName: string = normalizeName(this.props.workflow);

    return (
      <Headbar>
        <Breadcrumbs>
          <CollapsedCrumb
            links={{ Workflows: '/workflows', [workflowName]: backQueriesStr }}
          />
          <Crumb>
            ORDER{' '}
            <small>
              {this.props.data.id} v{this.props.data.version}
            </small>
          </Crumb>
          <CrumbTabs
            tabs={[
              'Overview',
              { title: 'Steps', suffix: `(${size(data.StepInstances)})` },
              'Data',
              { title: 'Errors', suffix: `(${size(data.ErrorInstances)})` },
              { title: 'Hierarchy', suffix: `(${size(data.HierarchyInfo)})` },
              { title: 'Audit', suffix: `(${size(data.AuditEvents)})` },
              'Info',
              { title: 'Notes', suffix: `(${size(data.notes)})` },
              'Log',
              'Code',
            ]}
          />
        </Breadcrumbs>
        <Pull right>
          <WorkflowControls
            id={this.props.workflow.id}
            enabled={this.props.workflow.enabled}
            remote={this.props.workflow.remote}
            big
          />
          <WorkflowAutostart
            id={this.props.workflow.id}
            autostart={this.props.workflow.autostart}
            execCount={this.props.workflow.exec_count}
            withExec
            big
          />
          <OrderControls
            id={this.props.data.id}
            workflowstatus={this.props.data.workflowstatus}
          />
          <Lock
            id={this.props.data.id}
            lock={this.props.data.operator_lock}
            big
          />
        </Pull>
      </Headbar>
    );
  }
}
