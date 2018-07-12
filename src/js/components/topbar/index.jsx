import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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
import map from 'lodash/map';

import Modal from '../../components/modal';
import withModal from '../../hocomponents/modal';
import logo from '../../../img/qore_logo.png';
import actions from '../../store/api/actions';
import { LANGS } from '../../intl/messages';
import Sidebar from '../sidebar';

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
@connect(
  null,
  {
    storeLocale: actions.currentUser.storeLocale,
  }
)
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
    locale: PropTypes.string,
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
    const [countryCode, locale] = this.props.locale.split('-');

    return (
      <Navbar className="pt-fixed-top pt-dark">
        {this.props.isTablet && (
          <NavbarGroup>
            <Popover
              position={Position.BOTTOM_LEFT}
              content={<Sidebar menuCollapsed={false} />}
            >
              <ButtonGroup minimal>
                <Button iconName="menu" />{' '}
              </ButtonGroup>
            </Popover>
          </NavbarGroup>
        )}
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
          <Popover
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                {map(
                  LANGS,
                  (loc, lang) =>
                    countryCode !== lang && (
                      <MenuItem
                        text={lang}
                        label={
                          <img
                            src={`http://www.countryflags.io/${lang.toLowerCase()}/flat/16.png`}
                          />
                        }
                        onClick={() => this.props.storeLocale(loc)}
                      />
                    )
                )}
                <MenuItem
                  text="Use browser locale"
                  onClick={() => this.props.storeLocale()}
                />
              </Menu>
            }
          >
            <ButtonGroup minimal>
              <Button>
                <img
                  src={`http://www.countryflags.io/${locale.toLowerCase()}/flat/16.png`}
                />{' '}
                {locale}
              </Button>
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
