// @ts-ignore ts-migrate(2307) FIXME: Cannot find module 'redux' or its corresponding ty... Remove this comment to see the full error message
import { connect } from 'react-redux';
import { compose } from 'redux';
import NotificationPanel from '../../../components/notifications';
import sync from '../../../hocomponents/sync';
import actions from '../../../store/api/actions';

export default compose(
  connect(
    (state) => ({
      alerts: state.api.alerts,
    }),
    {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'alerts' does not exist on type '{}'.
      load: actions.alerts.fetch,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'alerts' does not exist on type '{}'.
      clearNotifications: actions.alerts.markAllAsRead,
    }
  ),
  sync('alerts', false)
)(NotificationPanel);
