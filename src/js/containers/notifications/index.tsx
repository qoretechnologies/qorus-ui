/* @flow */
import map from 'lodash/map';
import size from 'lodash/size';
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { createSelector } from 'reselect';
import NotificationItem from '../bubbles/item';

type Props = {
  collection: Array<Object>;
};

export const NotificationsContainer = ({ collection }: Props) => {
  if (size(collection) === 0) {
    return null;
  }

  return (
    <div
      className="
        bp3-toast-container bp3-overlay bp3-overlay-open bp3-toast-container-bottom bp3-toast-container-right
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
  // @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
  const { data } = state.ui.notifications;
  const groupedNotifications: Object = {};

  data
    // @ts-ignore ts-migrate(2339) FIXME: Property 'read' does not exist on type 'Object'.
    .filter((datum: Object) => !datum.read)
    .forEach((datum: Object): void => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
      const objectItem: any = groupedNotifications[datum.alert];

      if (!objectItem) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
        groupedNotifications[datum.alert] = 0;
      }

      // @ts-ignore ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
      groupedNotifications[datum.alert] =
        // @ts-ignore ts-migrate(2339) FIXME: Property 'alert' does not exist on type 'Object'.
        groupedNotifications[datum.alert] + 1;
    });
  return groupedNotifications;
};

// @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
const viewSelector: Function = createSelector([groupNotifications], (collection) => ({
  collection,
}));

export default compose(connect(viewSelector))(NotificationsContainer);
