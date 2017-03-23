/* @flow */
import React from 'react';
import { Link } from 'react-router';

import { getAlertObjectLink } from '../../helpers/system';
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
      <div className={`${className} notifications-group`}>
        <h4 className="notifications-header">
          {title}
          <Control
            btnStyle="danger"
            className="clear-button pull-right"
            onClick={this.clear}
            stopPropagation
            label="Clear"
          />
        </h4>
        {notifications.map(item => (
          <div
            key={`notification_${item.alertid}`}
            className="notification"
          >
            <Link
              to={getAlertObjectLink(item.type, { name: item.name, id: item.id })}
              title={item.object}
            >
              {item.object}
            </Link>
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
