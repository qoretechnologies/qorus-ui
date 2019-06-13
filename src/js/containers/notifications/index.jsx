/* @flow */
import React from 'react';
import { connect } from 'react-redux';
import size from 'lodash/size';
import map from 'lodash/map';

import NotificationItem from '../bubbles/item';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';

type Props = {
  collection: Array<Object>,
};

export const NotificationsContainer = ({ collection }: Props) => {
  if (size(collection) === 0) {
    return null;
  }

  return (
    <div
      className="
        pt-toast-container pt-overlay pt-overlay-open pt-toast-container-bottom pt-toast-container-right
      "
    >
      <span>
        {map(collection, (item, key) => (
          <NotificationItem
            key={`notification_${key}`}
            bubble={{ notificationType: key, type: 'INFO' }}
            stack={item}
            type="notification"
          />
        ))}
      </span>
    </div>
  );
};

const groupNotifications: Function = (state: Object): Object => {
  const { data } = state.ui.notifications;
  const groupedNotifications: Object = {};

  data
    .filter((datum: Object) => !datum.read)
    .forEach(
      (datum: Object): void => {
        const objectItem: any = groupedNotifications[datum.alert];

        if (!objectItem) {
          groupedNotifications[datum.alert] = 0;
        }

        groupedNotifications[datum.alert] =
          groupedNotifications[datum.alert] + 1;
      }
    );
  return groupedNotifications;
};

const viewSelector: Function = createSelector(
  [groupNotifications],
  collection => ({
    collection,
  })
);

export default compose(connect(viewSelector))(NotificationsContainer);
