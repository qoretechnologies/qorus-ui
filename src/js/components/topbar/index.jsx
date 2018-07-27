import React, { Component } from 'react';
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
  Icon,
  MenuDivider,
} from '@blueprintjs/core';
import map from 'lodash/map';

import de from '../../../img/country_flags/de.png';
import gb from '../../../img/country_flags/gb.png';
import cz from '../../../img/country_flags/cz.png';

import Modal from '../../components/modal';
import withModal from '../../hocomponents/modal';
import logo from '../../../img/qore_logo.png';
import actions from '../../store/api/actions';
import { LANGS } from '../../intl/messages';
import Sidebar from '../sidebar';
import settings from '../../settings';
import { HEALTH_KEYS } from '../../constants/dashboard';

const flags: Object = {
  de,
  gb,
  cz,
};

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

export type Props = {
  info: Object,
  health: Object,
  currentUser: Object,
  isTablet?: boolean,
  onMenuToggle: () => void,
  showMenu?: boolean,
  openModal: Function,
  closeModal: Function,
  locale: string,
  light: boolean,
  onThemeClick: Function,
};

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
  props: Props;

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
    const {
      light,
      onThemeClick,
      health: { data },
    } = this.props;
    const [countryCode, locale] = this.props.locale.split('-');

    console.log(data);

    return (
      <Navbar className={`pt-fixed-top ${light ? '' : 'pt-dark'} topbar`}>
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
                        key={lang}
                        text={lang}
                        label={<img src={flags[lang.toLowerCase()]} />}
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
                <img src={flags[locale.toLowerCase()]} /> {locale}
              </Button>
            </ButtonGroup>
          </Popover>
          <NavbarDivider />
          {settings.PROTOCOL === 'http' && (
            <Tooltip
              intent={Intent.DANGER}
              content="You are currently using this site via an insecure connection.Some functionality requiring a secure connection will not be available."
              position={Position.LEFT}
            >
              <ButtonGroup minimal>
                <Button iconName="warning-sign" intent={Intent.DANGER} />
              </ButtonGroup>
            </Tooltip>
          )}
          <Popover
            position={Position.BOTTOM_RIGHT}
            content={
              <Menu>
                <MenuDivider title="System health" />
                <MenuItem
                  text={`Status: ${data.health}`}
                  intent={HEALTH_KEYS[data.health]}
                />
                <MenuItem text="Ongoing alerts" label={data.ongoing} />
                <MenuItem text="Transient alerts" label={data.transient} />
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
                <MenuDivider title="Remotes" />
                {data.remote.map((remote: Object) => (
                  <MenuItem
                    key={remote.name}
                    text={`${remote.name} - ${remote.health}`}
                    intent={HEALTH_KEYS[remote.health]}
                  />
                ))}
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
          <ButtonGroup minimal>
            <Button
              iconName={light ? 'moon' : 'flash'}
              onClick={onThemeClick}
            />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }
}
