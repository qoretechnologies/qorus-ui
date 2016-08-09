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
      load: actions.alerts.fetch,
      clearNotifications: actions.alerts.markAllAsRead,
    }
  ),
  sync('alerts', false)
)(NotificationPanel);
