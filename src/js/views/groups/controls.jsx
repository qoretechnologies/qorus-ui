import React, { Component, PropTypes } from 'react';
import { Control } from 'components/controls';
import { pureRender } from 'components/utils';
import actions from 'store/api/actions';

@pureRender
export default class GroupControls extends Component {
  static propTypes = {
    group: PropTypes.object,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  dispatchAction(action) {
    this.context.dispatch(
      actions.groups[action](this.props.group)
    );
  }

  handleEnable = () => {
    this.dispatchAction('enable');
  };

  handleDisable = () => {
    this.dispatchAction('disable');
  };

  render() {
    return (
      <div className="btn-controls">
        {this.props.group.enabled && (
          <Control
            title="Disable"
            icon="power-off"
            btnStyle="success"
            action={this.handleDisable}
          />
        )}
        {!this.props.group.enabled && (
          <Control
            title="Enable"
            icon="power-off"
            btnStyle="danger"
            action={this.handleEnable}
          />
        )}
      </div>
    );
  }
}
