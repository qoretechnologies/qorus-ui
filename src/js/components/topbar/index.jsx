import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { pureRender } from '../utils';
import UserInfo from '../../containers/user_info';
import NotificationPanel from '../../containers/system/alerts';
import { LocalHealth, RemoteHealth } from '../../containers/health';
import { Control as Button } from '../../components/controls';
import Icon from '../../components/icon';

/**
 * Display info about Qorus instance and logged in user.
 */
@pureRender
export default class Topbar extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isTablet: PropTypes.bool,
    onMenuToggle: PropTypes.func,
    showMenu: PropTypes.bool,
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

  handleSwitchClick = () => {
    document.cookie = 'backbone=true; expires=Tue, 31 Dec 2030 20:47:11 UTC; path=/';
    window.location.href = '/backbone/';
  }

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
            {this.props.isTablet && (
              <div className="pull-left">
                <Button
                  onClick={this.props.onMenuToggle}
                  big
                  className="menu-btn"
                >
                  <Icon
                    icon={this.props.showMenu ? 'arrow-circle-o-left' : 'arrow-circle-o-right'}
                  />
                </Button>
              </div>
            )}
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
              <div className="nav-btn-tooltip">
                <Button
                  big
                  btnStyle="warning"
                  onClick={this.handleSwitchClick}
                  label="Switch to old UI"
                  icon="warning"
                />
              </div>
              {' '}
              <LocalHealth />
              {' '}
              <RemoteHealth />
              {' '}
              <UserInfo user={this.props.currentUser} />
              {' '}
              <NotificationPanel />
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
