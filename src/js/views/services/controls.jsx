import React, { Component, PropTypes } from 'react';
import { Controls, Control } from 'components/controls';

import { pureRender } from 'components/utils';

import actions from 'store/api/actions';

@pureRender
export default class ServiceControls extends Component {
  static propTypes = {
    service: PropTypes.object,
  };


  static contextTypes = {
    dispatch: PropTypes.func,
  };


  dispatchAction(action) {
    this.context.dispatch(
      actions.services[action](this.props.service)
    );
  }

  dispatchDisable = () => this.dispatchAction('disable')
  dispatchEnable = () => this.dispatchAction('enable')
  dispatchReset = (event) => {
    if (this.props.service.status === 'loaded') {
      this.dispatchAction('reset');
    }
    return event;
  }
  dispatchLoad = () => this.dispatchAction('load')
  dispatchUnload = () => this.dispatchAction('unload')
  dispatchEnableAutostart = () => this.dispatchAction('autostartOn')
  dispatchDisableAutostart = () => this.dispatchAction('autostartOff')


  render() {
    return (
      <Controls>
        {this.props.service.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={this.dispatchDisable}
          />
        )}
        {!this.props.service.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={this.dispatchEnable}
          />
        )}
        {!this.props.service.autostart && (
          <Control
            title="Enable Autostart"
            icon="rocket"
            action={this.dispatchEnableAutostart}
          />
        )}
        {this.props.service.autostart && (
          <Control
            title="Disable Autostart"
            icon="rocket"
            btnStyle="success"
            action={this.dispatchDisableAutostart}
          />
        )}
        {this.props.service.status === 'unloaded' && (
          <Control
            title="Load"
            icon="ban"
            action={this.dispatchLoad}
          />
        )}
        {this.props.service.status === 'loaded' && (
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
          btnStyle={ this.props.service.status === 'loaded' ? 'warning' : 'na disabled' }
          action={ this.dispatchReset }
        />
      </Controls>
    );
  }
}
