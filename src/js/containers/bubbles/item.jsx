/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';

import { bubbles, notifications } from '../../store/ui/actions';
import { Bubble } from '../../components/bubbles';
import queryControl from '../../hocomponents/queryControl';
import qoreLogo from '../../../img/qore_logo_purple.png';

const timeoutByBubbleType = {
  WARNING: '30000',
  DANGER: '5000',
  SUCCESS: '5000',
  INFO: '5000',
};

type Props = {
  bubble: Object,
  dismiss: Function,
  timeout: number,
  type?: string,
  changeNotificationsPaneQuery: Function,
  stack: number,
  notificationsSound: boolean,
  notificationsBrowser: boolean,
  dismissNotification: Function,
  deleteBubble: Function,
};

export class BubbleItem extends React.Component {
  props: Props = this.props;
  _timeout: any;

  componentDidMount () {
    const { timeout, bubble, notificationsBrowser, type, stack } = this.props;
    const timeoutByType = timeout || timeoutByBubbleType[bubble.type];

    // Check if user has browser notifications turned on
    if (notificationsBrowser && type === 'notification') {
      // Send new notification
      const notif = new Notification(`New Qorus alert raised (${stack})`, {
        body: bubble.notificationType,
        icon: qoreLogo,
        tag: shortid.generate(),
      });
      // Open notifications pane on click
      notif.onclick = () => {
        this.props.changeNotificationsPaneQuery('open');
      };
    }

    this._timeout = setTimeout(this.handleDelete, timeoutByType);
  }

  componentWillReceiveProps (nextProps: Props) {
    if (
      this.props.bubble.type !== nextProps.bubble.type &&
      this.props.bubble.type === 'WARNING'
    ) {
      const timeoutByType =
        nextProps.timeout || timeoutByBubbleType[nextProps.bubble.type];

      this._timeout = setTimeout(this.handleDelete, timeoutByType);
    }

    if (this.props.stack < nextProps.stack) {
      this.cancelTimeout();

      const timeoutByType = timeoutByBubbleType[nextProps.bubble.type];

      this._timeout = setTimeout(this.handleDelete, timeoutByType);
    }
  }

  cancelTimeout: Function = () => {
    clearTimeout(this._timeout);
    this._timeout = null;
  };

  handleView: Function = () => {
    this.props.changeNotificationsPaneQuery('open');
    this.cancelTimeout();
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

  render () {
    const { bubble, type, stack, notificationsSound } = this.props;
    const message: string = bubble.notificationType || bubble.message;

    return (
      <Bubble
        onClick={this.handleDelete}
        onViewClick={type === 'notification' && this.handleView}
        type={bubble.type.toLowerCase()}
        stack={stack}
        notification={type === 'notification'}
        notificationsSound={notificationsSound}
        id={shortid.generate()}
      >
        {message}
      </Bubble>
    );
  }
}

export default compose(
  connect(
    ({
      api: {
        currentUser: {
          data: { storage },
        },
      },
    }) => ({
      notificationsSound: storage.settings.notificationsSound,
      notificationsBrowser: storage.settings.notificationsBrowser,
    }),
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
  onlyUpdateForKeys([
    'bubble',
    'timeout',
    'notificationsSound',
    'notificationsBrowser',
  ])
)(BubbleItem);
