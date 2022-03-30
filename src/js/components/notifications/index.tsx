/* @flow */
import React from 'react';

import Pane from '../pane';
import { SimpleTabs, SimpleTab } from '../SimpleTabs';
import { connect } from 'react-redux';
import { notifications } from '../../store/ui/actions';
import compose from 'recompose/compose';
import { NOTIFICATION_TYPES } from '../../constants/notifications';
import NotificationList from './list';
import lifecycle from 'recompose/lifecycle';

type Props = {
  width?: number,
  onClose: Function,
  onResize: Function,
  paneTab: string,
  collection: Array<Object>,
  collectionLen: number,
  read: Function,
};

const Notifications: Function = ({
  width,
  onClose,
  onResize,
  paneTab,
  collection,
}: Props) => (
  <Pane
    width={width || 600}
    onClose={onClose}
    onResize={onResize}
    title="Notifications"
    tabs={{
      tabs: [
        'All',
        'Workflows',
        'Services',
        'Jobs',
        'Groups',
        'Remotes',
        'Users',
        'Datasources',
        'Orders',
      ],
      queryIdentifier: 'notificationsPaneTab',
    }}
  >
    <SimpleTabs activeTab={paneTab}>
      <SimpleTab name="all">
        <NotificationList collection={collection} paneTab={paneTab} />
      </SimpleTab>
      {NOTIFICATION_TYPES.map(
        // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
        (notificationType: string): React.Element<SimpleTab> => (
          <SimpleTab key={notificationType} name={notificationType}>
            <NotificationList collection={collection} paneTab={paneTab} />
          </SimpleTab>
        )
      )}
    </SimpleTabs>
  </Pane>
);

export default compose(
  connect(
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
      collection: state.ui.notifications.data,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
      collectionLen: state.ui.notifications.count,
    }),
    {
      add: notifications.addNotification,
      read: notifications.readNotifications,
    }
  ),
  lifecycle({
    componentDidMount() {
      this.props.read();
    },
    componentDidUpdate() {
      this.props.read();
    },
  })
)(Notifications);
