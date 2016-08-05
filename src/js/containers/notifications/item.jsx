/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import { notifications } from '../../store/ui/actions';
import { Notification } from '../../components/notifications';

export class NotificationItem extends React.Component {
  props: {
    notification: Object,
    deleteNotification: Function,
    timeout: number
  }

  componentDidMount() {
    const { timeout = 5000 } = this.props;
    setTimeout(this.delete, timeout);
  }

  delete = () => {
    const { notification, deleteNotification } = this.props;
    deleteNotification(notification.id);
  }

  render() {
    const { notification: item } = this.props;
    return (
      <Notification
        onClick={this.delete}
        type={item.type.toLowerCase()}
      >
        {item.message}
      </Notification>
    );
  }
}

export default connect(
  () => ({}),
  notifications
)(NotificationItem);
