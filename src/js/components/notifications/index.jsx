/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import NotificationList from './list';
import ResizeHandle from '../resize/handle';
import Box from '../box';

type Props = {
  alerts: Object,
  clearNotifications: Function,
  isOpen?: boolean,
};

class NotificationPanel extends React.Component {
  static defaultProps = {
    alerts: { data: [], isOpen: false },
  };

  props: Props;

  state: {
    isOpen: boolean,
  };

  state = {
    isOpen: this.props.isOpen,
  };

  componentWillReceiveProps(newProps: Props) {
    if (this.state.isOpen !== newProps.isOpen) {
      this.setState({ isOpen: newProps.isOpen });
    }
  }

  handleClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleOutsideClick = (event: Object): void => {
    const el: Object = ReactDOM.findDOMNode(this.refs.panel);

    if (el && !el.contains(event.target)) {
      this.setState({
        isOpen: false,
      });
    }
  };

  render() {
    const {
      clearNotifications,
      alerts: { data = [] },
    } = this.props;
    const notificationList = data.filter(item => !item._read);
    let panel = null;

    if (this.state.isOpen && notificationList.length > 0) {
      const ongoingNotifications = notificationList.filter(
        item => item.alerttype === 'ONGOING'
      );
      const transientNotifications = notificationList.filter(
        item => item.alerttype === 'TRANSIENT'
      );

      panel = (
        <div className="pane right notifications-list">
          <div className="pane__content">
            <Box>
              {ongoingNotifications.length > 0 ? (
                <NotificationList
                  title="Ongoing"
                  type="ONGOING"
                  className={`ongoing ${
                    transientNotifications.length === 0 ? 'full-grp' : ''
                  }`}
                  clearNotifications={clearNotifications}
                  notifications={ongoingNotifications}
                />
              ) : null}
              {transientNotifications.length > 0 ? (
                <NotificationList
                  title="Transient"
                  type="TRANSIENT"
                  className={`transient ${
                    ongoingNotifications.length === 0 ? 'full-grp' : ''
                  }`}
                  clearNotifications={clearNotifications}
                  notifications={transientNotifications}
                />
              ) : null}
            </Box>
          </div>
          <ResizeHandle left min={{ width: 400 }} />
        </div>
      );
    }

    if (this.state.isOpen && notificationList.length === 0) {
      panel = (
        <div className="pane right notifications-list">
          <div className="pane__content">
            <Box>
              <div className="full-grp notifications-group">
                <h5 className="notifications-header">No notifications</h5>
              </div>
            </Box>
          </div>
          <ResizeHandle left min={{ width: 400 }} />
        </div>
      );
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="notification-list"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        component="div"
      >
        {panel}
      </ReactCSSTransitionGroup>
    );
  }
}

export default NotificationPanel;
