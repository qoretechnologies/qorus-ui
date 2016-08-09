/* @flow */
import React from 'react';

import { Control } from '../controls';
import DateComponent from '../date';

class NotificationList extends React.Component {
  props: {
    title: string,
    type: string,
    className: string,
    notifications: Array<*>,
    clearNotifications: Function,
  }

  clear = () => {
    const { type, clearNotifications } = this.props;
    clearNotifications(type);
  }

  render() {
    const { title, className, notifications } = this.props;

    return (
      <div className={className}>
        <h4>{title}</h4>
        <div className="clear-button-place">
          <Control
            btnStyle="primary"
            className="btn-block clear-button"
            onClick={this.clear}
            big
          >
            clear
          </Control>
        </div>
        {notifications.map(item => (
          <div
            key={`notification_${item.alertid}`}
            className="notification"
          >
            <h5>{item.alert}</h5>
            <div>
              <strong>Date:</strong>
              {' '}
              <DateComponent
                date={item.when}
                format="YYYY-MM-DD HH:mm:ss"
              />
            </div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default NotificationList;
