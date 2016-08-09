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

  renderNotificationList() {
    const { clearNotifications, alerts: { data: notificationList } } = this.props;
    const ongoingNotifications = notificationList.filter(item => item.alerttype === 'ONGOING');
    const transientNotifications = notificationList.filter(item => item.alerttype === 'TRANSIENT');

    return (
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
