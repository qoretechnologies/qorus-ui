/* @flow */
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import { NotificationList } from '../../components/notifications';
import NotificationItem from './item';

const Notifications = ({ notificationList }: { notificationList: Array<*> }) => (
  <NotificationList>
    <ReactCSSTransitionGroup
      transitionName="notification"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      {notificationList.map(
        item => (
          <NotificationItem
            key={`notification_${item.id}`}
            notification={item}
          />
        )
      )}
    </ReactCSSTransitionGroup>
  </NotificationList>
);

export default connect(
  state => ({
    notificationList: state.ui.notifications.list || [],
  })
)(Notifications);
