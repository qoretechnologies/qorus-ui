/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import { bubbles, notifications } from '../../store/ui/actions';
import { Bubble } from '../../components/bubbles';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import queryControl from '../../hocomponents/queryControl';

const timeoutByBubbleType = {
  WARNING: '60000',
  DANGER: '6000',
  SUCCESS: '3000',
  INFO: '5000',
};

type Props = {
  bubble: Object,
  dismiss: Function,
  timeout: number,
  type?: string,
  changeNotificationsPaneQuery: Function,
  stack: number,
};

export class BubbleItem extends React.Component {
  props: Props;
  _timeout: any;

  componentDidMount() {
    const { timeout, bubble } = this.props;
    const timeoutByType = timeout || timeoutByBubbleType[bubble.type];

    if (bubble.type !== 'WARNING') {
      // this._timeout = setTimeout(this.handleDelete, timeoutByType);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.bubble.type !== nextProps.bubble.type &&
      this.props.bubble.type === 'WARNING'
    ) {
      const timeoutByType =
        nextProps.timeout || timeoutByBubbleType[nextProps.bubble.type];

      this._timeout = setTimeout(this.handleDelete, timeoutByType);
    }
  }

  handleView: Function = () => {
    this.props.changeNotificationsPaneQuery('open');

    clearTimeout(this._timeout);
    this._timeout = null;

    this.handleDelete('all');
  };

  handleDelete = (dismissType: ?string) => {
    const { bubble, dismiss, type } = this.props;

    if (dismissType && dismissType === 'all') {
      dismiss('all');
    } else {
      dismiss(type === 'notification' ? bubble.notificationType : bubble.id);
    }
  };

  render() {
    const { bubble: item, type, stack } = this.props;
    const message: string = item.notificationType || item.message;

    return (
      <Bubble
        onClick={this.handleDelete}
        onViewClick={type === 'notification' && this.handleView}
        type={item.type.toLowerCase()}
        stack={stack}
      >
        {message}
      </Bubble>
    );
  }
}

export default compose(
  connect(
    null,
    {
      ...bubbles,
      ...notifications,
    }
  ),
  mapProps((props: Props) => ({
    dismiss:
      props.type === 'notification'
        ? props.dismissNotification
        : props.deleteBubble,
    ...props,
  })),
  queryControl('notificationsPane'),
  onlyUpdateForKeys(['bubble', 'timeout'])
)(BubbleItem);
