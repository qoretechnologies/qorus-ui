import React, { Component, PropTypes } from 'react';

import Dropdown, { Control as DControl, Item } from 'components/dropdown';
import { Control } from 'components/controls';

import { ModalExpiry, ModalReschedule } from './modals';

import { pureRender } from 'components/utils';

import actions from 'store/api/actions';

@pureRender
export default class ServiceControls extends Component {
  static propTypes = {
    job: PropTypes.object,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this._modal = null;
  }

  dispatchAction(action) {
    this.context.dispatch(
      actions.jobs[action](this.props.job)
    );
  }

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
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={this.handleDisable}
          />
        )}
        {!this.props.job.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={this.handleEnable}
          />
        )}
        {this.props.job.active && (
          <Control
            title="Deactivate"
            icon="check"
            btnStyle="success"
            action={this.handleDeactivate}
          />
        )}
        {!this.props.job.active && (
          <Control
            title="Activate"
            icon="ban"
            btnStyle="danger"
            action={this.handleActivate}
          />
        )}
        <Dropdown>
          <DControl />
          <Item action={ this.handleRun } icon="play" title="Run" />
          <Item action={ this.handleReschedule } icon="clock-o" title="Reschedule" />
          <Item action={ this.handle } icon="refresh" title="Reset" />
          <Item action={ this.handleExpiration } icon="tag" title="Set expiration" />
        </Dropdown>
      </div>
    );
  }
}
