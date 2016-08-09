import { compose } from 'redux';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps'

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
  mapProps(props => ({
    ...props,
    ...{
      alerts: {
        ...props.alerts,
        data: props.alerts.data.filter(item => !item._read),
      },
    },
  })),
  sync('alerts', false)
)(NotificationPanel);
