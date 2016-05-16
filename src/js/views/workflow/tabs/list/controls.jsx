import React, { Component, PropTypes } from 'react';
import { pureRender } from 'components/utils';
import { includes } from 'lodash';

import { Control as Button, Controls } from '../../../../components/controls';

import { ORDER_ACTIONS } from 'constants/orders';

@pureRender
export default class extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    this._actions = ORDER_ACTIONS.ALL;
  }

  renderControls = () => {
    const allActions = ORDER_ACTIONS.ALL;
    const currentActions = ORDER_ACTIONS[this.props.data.workflowstatus];

    return allActions.map(a => {
      let style = 'default';
      let disabled = true;

      if (includes(currentActions, a.name)) {
        style = a.style;
        disabled = false;
      }

      return (
        <Button
          btnStyle={style}
          icon={a.icon}
          disabled={disabled}
        />
      );
    });
  };

  renderBlock = () => {
    const action = this.props.data.workflowstatus === 'BLOCKED' ?
      'Unblock' : 'Block';

    return this.renderAction(action);
  };

  renderCancel = () => {
    const action = this.props.data.workflowstatus === 'CANCELED' ?
      'Uncancel' : 'Cancel';

    return this.renderAction(action);
  };

  renderAction = (action) => {
    const actions = ORDER_ACTIONS[this.props.data.workflowstatus];
    let { name, icon, style } = this._actions.find(a => a.name === action);
    let disabled = false;

    if (!includes(actions, action)) {
      style = 'default';
      disabled = true;
    }

    return (
      <Button
        btnStyle={style}
        icon={icon}
        disabled={disabled}
        title={name}
      />
    );
  };

  render() {
    return (
      <Controls>
        { this.renderBlock() }
        { this.renderCancel() }
        { this.renderAction('Retry') }
        { this.renderAction('Schedule') }
      </Controls>
    );
  }
}
