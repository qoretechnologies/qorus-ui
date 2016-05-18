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
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  componentWillMount() {
    this._allActions = ORDER_ACTIONS.ALL;
  }

  handleAction = (action) => {
    this.context.dispatch(actions.orders[action](this.props.data));
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
    return (
      <Controls>
        { this.renderBlock() }
        { this.renderCancel() }
        { this.renderControl('retry') }
        { this.renderControl('schedule') }
      </Controls>
    );
  }
}
