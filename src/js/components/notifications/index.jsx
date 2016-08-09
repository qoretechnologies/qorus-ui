/* @flow */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Control } from '../controls';
import Badge from '../badge';
import NotificationList from './list';


class NotificationPanel extends React.Component {
  static defaultProps = {
    alerts: { data: [] },
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

  render() {
    const { clearNotifications, alerts: { data = [] } } = this.props;
    const notificationList = data.filter(item => !item._read);
    const listLength = notificationList.length;
    let panel = null;

    if (this.state.isOpen && notificationList.length > 0) {
      const ongoingNotifications = notificationList.filter(
        item => item.alerttype === 'ONGOING'
      );
      const transientNotifications = notificationList.filter(
        item => item.alerttype === 'TRANSIENT'
      );

      panel = (
        <div className="notification-list">
          {ongoingNotifications.length > 0 ? (
            <NotificationList
              title="Ongoing"
              type="ONGOING"
              className="ongoing"
              clearNotifications={clearNotifications}
              notifications={ongoingNotifications}
            />
          ) : null}
          {transientNotifications.length > 0 ? (
            <NotificationList
              title="Transient"
              type="TRANSIENT"
              className="transient"
              clearNotifications={clearNotifications}
              notifications={transientNotifications}
            />
          ) : null}
        </div>
      );
    }

    if (this.state.isOpen && notificationList.length === 0) {
      panel = (
        <div className="notification-list">
          <h4 className="no-notifications">No notifications</h4>
        </div>
      );
    }

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
          {panel}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default NotificationPanel;
