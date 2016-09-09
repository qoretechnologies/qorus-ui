import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import Dropdown, { Control as DControl, Item } from 'components/dropdown';
import { Control } from 'components/controls';
import { ModalExpiry, ModalReschedule } from './modals';

import actions from 'store/api/actions';


@compose(
  onlyUpdateForKeys(['job']),
  connect(
    () => ({}),
    actions.jobs
  ),
)
export default class ServiceControls extends Component {
  static propTypes = {
    job: PropTypes.object,
  };

  static contextTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this._modal = null;
  }

  dispatchAction(action) {
    this.props[action](this.props.job);
  }

  handleEnable = () => {
    this.dispatchAction('enable');
  };

  handleDisable = () => {
    this.dispatchAction('disable');
  };

  handleActivate = () => {
    this.dispatchAction('activate');
  };

  handleDeactivate = () => {
    this.dispatchAction('deactivate');
  };

  handleReset = () => {
    this.dispatchAction('reset');
  };

  handleRun = (event) => {
    event.preventDefault();
    this.dispatchAction('run');
  };

  handleExpiration= (event) => {
    event.preventDefault();
    this.openModal(ModalExpiry, this.props.job);
  };

  handleReschedule = (event) => {
    event.preventDefault();
    this.openModal(ModalReschedule, this.props.job);
  };

  /**
   * Opens modal dialog to manage particular error.
   *
   * @param {ReactComponent} Modal Component
   * @param {Object} job
   */
  openModal = (Modal, job) => {
    this._modal = (
      <Modal
        job={job}
        onClose={this.closeModal}
      />
    );

    this.context.openModal(this._modal);
  };

  /**
   * Closes currently open modal dialog.
   */
  closeModal = () => {
    this.context.closeModal(this._modal);
    this._modal = null;
  };

  render() {
    return (
      <div className="btn-controls">
        {this.props.job.enabled && (
          <Control
            id={`job-${this.props.job.id}-enabled`}
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={this.handleDisable}
          />
        )}
        {!this.props.job.enabled && (
          <Control
            id={`job-${this.props.job.id}-disabled`}
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={this.handleEnable}
          />
        )}
        {this.props.job.active && (
          <Control
            id={`job-${this.props.job.id}-active`}
            title="Deactivate"
            icon="check"
            btnStyle="success"
            action={this.handleDeactivate}
          />
        )}
        {!this.props.job.active && (
          <Control
            id={`job-${this.props.job.id}-unactive`}
            title="Activate"
            icon="ban"
            btnStyle="danger"
            action={this.handleActivate}
          />
        )}
        <Dropdown id={`job-${this.props.job.id}`}>
          <DControl id={`job-${this.props.job.id}-dropdown-control`} />
          <Item
            action={this.handleRun}
            icon="play"
            title="Run"
            className="run-job"
          />
          <Item
            action={this.handleReschedule}
            icon="clock-o"
            title="Reschedule"
            className="reshedule-job"
          />
          <Item
            action={this.handle}
            icon="refresh"
            title="Reset"
            className="refresh-job"
          />
          <Item
            action={this.handleExpiration}
            icon="tag"
            title="Set expiration"
            className="set-expiraction"
          />
        </Dropdown>
      </div>
    );
  }
}
