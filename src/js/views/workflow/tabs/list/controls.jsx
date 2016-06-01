import React, { Component, PropTypes } from 'react';
import { pureRender } from 'components/utils';
import { includes } from 'lodash';

import actions from 'store/api/actions';

import { Control as Button, Controls } from '../../../../components/controls';

import { ORDER_ACTIONS } from 'constants/orders';

@pureRender
export default class extends Component {
  static propTypes = {
    data: PropTypes.object,
    onScheduleClick: PropTypes.func,
    showText: PropTypes.bool,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    this._allActions = ORDER_ACTIONS.ALL;
  }

  handleAction = (action) => {
    if (action === 'schedule') {
      this.props.onScheduleClick(this.props.data);
    } else {
      this.context.dispatch(actions.orders[action](this.props.data));
    }
  };

  renderBlock = () => {
    const control = this.props.data.workflowstatus === 'BLOCKED' ?
      'unblock' : 'block';

    return this.renderControl(control);
  };

  renderCancel = () => {
    const control = this.props.data.workflowstatus === 'CANCELED' ?
      'uncancel' : 'cancel';

    return this.renderControl(control);
  };

  renderControl = (control) => {
    const orderActions = ORDER_ACTIONS[this.props.data.workflowstatus];
    let { name, icon, style, action } = this._allActions.find(a => a.action === control);
    const onClick = () => this.handleAction(action);
    let disabled = false;

    if (!includes(orderActions, control)) {
      style = 'default';
      disabled = true;
    }

    if (this.props.showText) {
      return (
        <Button
          btnStyle={style}
          label={action.toUpperCase()}
          disabled={disabled}
          title={name}
          action={onClick}
        />
      );
    }

    return (
      <Button
        btnStyle={style}
        icon={icon}
        disabled={disabled}
        title={name}
        action={onClick}
      />
    );
  };

  render() {
    const props = this.props.showText ? { noControls: true, grouped: true } : {};

    return (
      <Controls {...props}>
        { this.renderBlock() }
        { this.renderCancel() }
        { this.renderControl('retry') }
        { this.renderControl('schedule') }
      </Controls>
    );
  }
}
