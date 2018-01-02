import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { pureRender } from '../utils';
import UserInfo from '../../containers/user_info';
import NotificationPanel from '../../containers/system/alerts';
import { LocalHealth, RemoteHealth } from '../../containers/health';
import { Control as Button } from '../../components/controls';
import Icon from '../../components/icon';
import Modal from '../../components/modal';
import settings from '../../settings';
import withModal from '../../hocomponents/modal';
import logo from '../../../img/qore_logo.png';

const WarningModal: Function = ({ onClose }: Object): React.Element<any> => (
  <Modal>
    <Modal.Header
      titleId="warningModal"
      onClose={onClose}
    > Insecure connection </Modal.Header>
    <Modal.Body>
      <p>
        You are currently using this site via an insecure connection.
        Some functionality requiring a secure connection will not be available.
      </p>
    </Modal.Body>
  </Modal>
);

/**
 * Display info about Qorus instance and logged in user.
 */
@pureRender
@withModal()
export default class Topbar extends Component {
  static propTypes = {
    info: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    isTablet: PropTypes.bool,
    onMenuToggle: PropTypes.func,
    showMenu: PropTypes.bool,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
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

  handleWarningClick = () => {
    this.props.openModal(
      <WarningModal onClose={this.props.closeModal} />
    );
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
            <div
              className="navbar-brand h2 topbar__instance"
              onClick={settings.PROTOCOL === 'http:' ? this.handleWarningClick : null}
            >
              <img src={logo} className="qore-small-logo" />
              {this.props.info['instance-key']}
              {' '}
              {settings.PROTOCOL === 'http:' && (
                <Icon icon="warning" className="text-danger" />
              )}
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
