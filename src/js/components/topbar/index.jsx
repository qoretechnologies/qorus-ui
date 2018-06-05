import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
  ButtonGroup,
  Popover,
  Position,
  Intent,
  Menu,
  MenuItem,
  Tooltip,
} from '@blueprintjs/core';

import { pureRender } from '../utils';
import Modal from '../../components/modal';
import withModal from '../../hocomponents/modal';
import logo from '../../../img/qore_logo.png';

const WarningModal: Function = ({ onClose }: Object): React.Element<any> => (
  <Modal>
    <Modal.Header titleId="warningModal" onClose={onClose}>
      {' '}
      Insecure connection{' '}
    </Modal.Header>
    <Modal.Body>
      <p>
        You are currently using this site via an insecure connection. Some
        functionality requiring a secure connection will not be available.
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
    this.props.openModal(<WarningModal onClose={this.props.closeModal} />);
  };

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    return (
      <Navbar className="pt-fixed-top pt-dark">
        <NavbarGroup>
          <NavbarHeading className="nunito">
            <img src={logo} className="qore-small-logo" /> Qorus Integration
            Engine | {this.props.info.data['instance-key']}{' '}
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align="right">
          <Popover
            position={Position.BOTTOM}
            useSmartPositioning
            content={
              <Menu>
                <MenuItem
                  text="Logout"
                  iconName="log-out"
                  onClick={() => browserHistory.push('/logout')}
                />
              </Menu>
            }
          >
            <ButtonGroup minimal>
              <Button
                iconName="user"
                text="Qorus administrator"
                rightIconName="caret-down"
              />
            </ButtonGroup>
          </Popover>
          <NavbarDivider />
          <Tooltip
            intent={Intent.DANGER}
            content="You are currently using this site via an insecure connection.Some functionality requiring a secure connection will not be available."
            position={Position.LEFT}
          >
            <ButtonGroup minimal>
              <Button iconName="warning-sign" intent={Intent.DANGER} />
            </ButtonGroup>
          </Tooltip>
          <Popover
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                <MenuItem
                  text="Logout"
                  iconName="log-out"
                  onClick={() => browserHistory.push('/logout')}
                />
              </Menu>
            }
          >
            <ButtonGroup minimal>
              <Button iconName="build" intent={Intent.WARNING} />
            </ButtonGroup>
          </Popover>
          <Popover
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                <MenuItem
                  text="Logout"
                  iconName="log-out"
                  onClick={() => browserHistory.push('/logout')}
                />
              </Menu>
            }
          >
            <ButtonGroup minimal>
              <Button iconName="share" />
            </ButtonGroup>
          </Popover>
          <ButtonGroup minimal>
            <Button iconName="notifications" />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }
}
