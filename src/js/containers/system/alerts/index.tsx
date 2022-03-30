// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { compose } from 'redux';
import { connect } from 'react-redux';

import sync from '../../../hocomponents/sync';
import actions from '../../../store/api/actions';

import NotificationPanel from '../../../components/notifications';

export default compose(
  connect(
    state => ({
      alerts: state.api.alerts,
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type '{}'.
      load: actions.alerts.fetch,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'alerts' does not exist on type '{}'.
      clearNotifications: actions.alerts.markAllAsRead,
    }
  ),
  sync('alerts', false)
)(NotificationPanel);
