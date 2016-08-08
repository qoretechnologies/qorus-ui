/* @flow */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Control } from '../controls';
import Badge from '../badge';


class NotificationPanel extends React.Component {
  static defaultProps = {
    alerts: { data: [] },
    clearNotifications: () => {},
  }

  props: {
    alerts: Object,
    clearNotifications: Function,
  }

  state: {
    isOpen: boolean,
  }

  state = {
    isOpen: false,
  }

  handleClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  renderNotificationList() {
    const { clearNotifications, alerts: { data: notificationList } } = this.props;
    return (
      <div className="notification-list">
        <div className="clear-button-place">
          <Control
            btnStyle="primary"
            className="btn-block clear-button"
            onClick={clearNotifications}
            big
          >
            clear
          </Control>
        </div>
        {notificationList.map(item => (
          <div
            key={`notification_${item.alertid}`}
            className="notification"
          >
            <h5>{item.alert}</h5>
            <div><strong>Date:</strong>{item.when}</div>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { alerts: { data: notificationList = [] } } = this.props;
    const listLength = notificationList.length;
    return (
      <div className="notification-panel nav-btn-tooltip">
        <Control
          icon="bell"
          btnStyle="inverse"
          onClick={this.handleClick}
          className="notification-button"
          big
        >
          {' '}
          { listLength > 0 ? <Badge label="danger" val={listLength.toString()} /> : null }
        </Control>
        <ReactCSSTransitionGroup
          transitionName="notification-list"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
          component="div"
        >
          { this.state.isOpen ? this.renderNotificationList() : null }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default NotificationPanel;
