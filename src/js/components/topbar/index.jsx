import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { pureRender } from '../utils';
import UserInfo from '../../containers/user_info';
import NotificationPanel from '../notifications';
import { LocalHealth, RemoteHealth } from '../../containers/health';

const notificationList = [{
  type: 'GROUP',
  id: -3,
  alerttype: 'ONGOING',
  when: '2016-08-05 19:29:01.231166 +06:00',
  local: true,
  alert: 'INTERFACE-GROUP-DISABLED',
  alertid: 2,
  reason: 'external API call',
  who: 'admin',
  source: 'ipv6[::1]:64878 listener: ipv6[::]:8001',
  object: 'GROUP info (-3)',
  instance: 'qorus-test-instance',
  name: 'info',
  auditid: null,
}, {
  type: 'GROUP',
  id: -6,
  alerttype: 'ONGOING',
  when: '2016-08-05 19:29:49.811845 +06:00',
  local: true,
  alert: 'INTERFACE-GROUP-DISABLED',
  alertid: 3,
  reason: 'external API call',
  who: 'admin',
  source: 'ipv6[::1]:64890 listener: ipv6[::]:8001',
  object: 'GROUP queue (-6)',
  instance: 'qorus-test-instance',
  name: 'queue',
  auditid: null,
}, {
  type: 'GROUP',
  id: -8,
  alerttype: 'ONGOING',
  when: '2016-08-05 19:29:57.977416 +06:00',
  local: true,
  alert: 'INTERFACE-GROUP-DISABLED',
  alertid: 6,
  reason: 'external API call',
  who: 'admin',
  source: 'ipv6[::1]:64878 listener: ipv6[::]:8001',
  object: 'GROUP sqlutil (-8)',
  instance: 'qorus-test-instance',
  name: 'sqlutil',
  auditid: null,
}, {
  type: 'GROUP',
  id: -2,
  alerttype: 'ONGOING',
  when: '2016-08-05 19:30:03.283602 +06:00',
  local: true,
  alert: 'INTERFACE-GROUP-DISABLED',
  alertid: 7,
  reason: 'external API call',
  who: 'admin',
  source: 'ipv6[::1]:64878 listener: ipv6[::]:8001',
  object: 'GROUP fs (-2)',
  instance: 'qorus-test-instance',
  name: 'fs',
  auditid: null,
}];

/**
 * Display info about Qorus instance and logged in user.
 */
@pureRender
export default class Topbar extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
  };

  /**
   * Sets up default expanded state to false.
   */
  componentWillMount() {
    this.setState({ expanded: false });
  }

  /**
   * Toggle expanded state value.
   */
  handleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top topbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className={classNames({
                'navbar-toggle': true,
                collapsed: !this.state.expanded,
              })}
              aria-expanded={this.state.expanded ? true : 'false'}
              onClick={this.handleExpand}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <div className="navbar-brand h2 topbar__instance">
              {this.props.info['instance-key']}
            </div>
          </div>

          <div
            className={classNames({
              'navbar-collapse': true,
              collapse: true,
              in: this.state.expanded,
            })}
            style={{ height: !this.state.expanded && '1px' }}
            aria-expanded={this.state.expanded ? 'true' : 'false'}
          >
            <div className="nav nav-bar navbar-right info-nav">
              <LocalHealth />
              {' '}
              <RemoteHealth />
              {' '}
              <UserInfo user={this.props.currentUser} />
              {' '}
              <NotificationPanel notificationList={notificationList} />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
