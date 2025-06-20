/* @flow */
import { ReqoreNotification } from '@qoretechnologies/reqore';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import shortid from 'shortid';
import qoreLogo from '../../../img/qore_logo_purple.png';
import queryControl from '../../hocomponents/queryControl';
import { bubbles, notifications } from '../../store/ui/actions';

const timeoutByBubbleType = {
  WARNING: '30000',
  DANGER: '60000',
  SUCCESS: '5000',
  INFO: '5000',
};

type Props = {
  bubble: any;
  dismiss: Function;
  timeout: number;
  type?: string;
  changeNotificationsPaneQuery: Function;
  stack: number;
  notificationsSound: boolean;
  notificationsBrowser: boolean;
  dismissNotification: Function;
  deleteBubble: Function;
};

export class BubbleItem extends React.Component {
  props: Props = this.props;
  _timeout: any;

  componentDidMount() {
    const { timeout, bubble, notificationsBrowser, type, stack } = this.props;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
    const timeoutByType = timeout || timeoutByBubbleType[bubble.type];

    // Check if user has browser notifications turned on
    if (notificationsBrowser && type === 'notification') {
      // Send new notification
      const notif = new Notification(`New Qorus alert raised (${stack})`, {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'notificationType' does not exist on type... Remove this comment to see the full error message
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

  componentWillReceiveProps(nextProps: Props) {
    if (
      // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
      this.props.bubble.type !== nextProps.bubble.type &&
      // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
      this.props.bubble.type === 'WARNING'
    ) {
      const timeoutByType =
        // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
        nextProps.timeout || timeoutByBubbleType[nextProps.bubble.type];

      this._timeout = setTimeout(this.handleDelete, timeoutByType);
    }

    if (this.props.stack < nextProps.stack) {
      this.cancelTimeout();

      // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
      const timeoutByType = timeoutByBubbleType[nextProps.bubble.type];

      this._timeout = setTimeout(this.handleDelete, timeoutByType);
    }
  }

  cancelTimeout: Function = () => {
    clearTimeout(this._timeout);
    this._timeout = null;
  };

  handleView = () => {
    this.props.changeNotificationsPaneQuery('open');
    this.cancelTimeout();
    this.handleDelete('all');
  };

  // @ts-ignore ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  handleDelete = (dismissType?: string) => {
    const { bubble, dismiss, type } = this.props;

    if (dismissType && dismissType === 'all') {
      dismiss('all');
    } else {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'notificationType' does not exist on type... Remove this comment to see the full error message
      dismiss(type === 'notification' ? bubble.notificationType : bubble.id);
    }
  };

  render() {
    console.log(this.props);
    const { bubble, type, timeout, stack, notificationsSound } = this.props;
    const timeoutByType = timeout || timeoutByBubbleType[bubble.type];
    // @ts-ignore ts-migrate(2339) FIXME: Property 'notificationType' does not exist on type... Remove this comment to see the full error message
    const message: string = bubble.notificationType || bubble.message;

    return (
      <ReqoreNotification
        duration={timeoutByType}
        onClose={() => this.handleDelete()}
        content={message}
        opaque
        onClick={type === 'notification' && this.handleView}
        // @ts-ignore ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Object'.
        intent={bubble.type.toLowerCase()}
      />
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
    dismiss: props.type === 'notification' ? props.dismissNotification : props.deleteBubble,
    ...props,
  })),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 3-4 arguments, but got 1.
  queryControl('notificationsPane'),
  onlyUpdateForKeys(['bubble', 'timeout', 'notificationsSound', 'notificationsBrowser'])
)(BubbleItem);
