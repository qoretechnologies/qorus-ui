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


  render() {
    const dispatchDisable = () => this.dispatchAction('disable');
    const dispatchEnable = () => this.dispatchAction('enable');
    const dispatchReset = () => this.dispatchAction('reset');
    const dispatchLoad = () => this.dispatchAction('load');
    const dispatchUnload = () => this.dispatchAction('unload');
    const dispatchEnableAutostart = () => this.dispatchAction('autostartOn');
    const dispatchDisableAutostart = () => this.dispatchAction('autostartOff');

    return (
      <Controls>
        {this.props.service.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={dispatchDisable}
          />
        )}
        {!this.props.service.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={dispatchEnable}
          />
        )}
        {!this.props.service.autostart && (
          <Control
            title="Enable Autostart"
            icon="rocket"
            action={dispatchEnableAutostart}
          />
        )}
        {this.props.service.autostart && (
          <Control
            title="Disable Autostart"
            icon="rocket"
            btnStyle="success"
            action={dispatchDisableAutostart}
          />
        )}
        {this.props.service.status === 'unloaded' && (
          <Control
            title="Load"
            icon="ban"
            action={dispatchLoad}
          />
        )}
        {this.props.service.status !== 'unloaded' && (
          <Control
            title="Unload"
            icon="check"
            btnStyle="success"
            action={dispatchUnload}
          />
        )}
        <Control
          title="Reset"
          icon="refresh"
          btnStyle={ this.props.service.status === 'unloaded' ? '' : 'warning' }
          action={dispatchReset}
        />
      </Controls>
    );
  }
}
