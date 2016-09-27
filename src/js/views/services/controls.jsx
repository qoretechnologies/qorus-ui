import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';
import actions from 'store/api/actions';

export default class ServiceControls extends Component {
  static propTypes = {
    service: PropTypes.object,
    status: PropTypes.string,
    enabled: PropTypes.bool,
    autostart: PropTypes.bool,
  };


  static contextTypes = {
    dispatch: PropTypes.func,
  };

  dispatchAction(action) {
    this.context.dispatch(
      actions.services[action](this.props.service)
    );
  }

  dispatchDisable = () => this.dispatchAction('disable');
  dispatchEnable = () => this.dispatchAction('enable');
  dispatchReset = (event) => {
    if (this.props.status === 'loaded') {
      this.dispatchAction('reset');
    }
    return event;
  };
  dispatchLoad = () => this.dispatchAction('load');
  dispatchUnload = () => this.dispatchAction('unload');
  dispatchEnableAutostart = () => this.dispatchAction('autostartOn');
  dispatchDisableAutostart = () => this.dispatchAction('autostartOff');


  render() {
    return (
      <Controls>
        {this.props.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={this.dispatchDisable}
          />
        )}
        {!this.props.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={this.dispatchEnable}
          />
        )}
        {!this.props.autostart && (
          <Control
            title="Enable Autostart"
            icon="rocket"
            action={this.dispatchEnableAutostart}
          />
        )}
        {this.props.autostart && (
          <Control
            title="Disable Autostart"
            icon="rocket"
            btnStyle="success"
            action={this.dispatchDisableAutostart}
          />
        )}
        {this.props.status === 'unloaded' && (
          <Control
            title="Load"
            icon="ban"
            action={this.dispatchLoad}
          />
        )}
        {this.props.status === 'loaded' && (
          <Control
            title="Unload"
            icon="check"
            btnStyle="success"
            action={this.dispatchUnload}
          />
        )}
        <Control
          title="Reset"
          icon="refresh"
          btnStyle={ this.props.status === 'loaded' ? 'warning' : 'na disabled' }
          action={ this.dispatchReset }
        />
      </Controls>
    );
  }
}
