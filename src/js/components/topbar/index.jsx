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
  MenuDivider,
} from '@blueprintjs/core';
import map from 'lodash/map';

import de from '../../../img/country_flags/de.png';
import gb from '../../../img/country_flags/gb.png';
import cz from '../../../img/country_flags/cz.png';
import en from '../../../img/country_flags/us.png';

import withModal from '../../hocomponents/modal';
import logo from '../../../img/qore_logo.png';
import actions from '../../store/api/actions';
import { LANGS } from '../../intl/messages';
import settings from '../../settings';
import { HEALTH_KEYS } from '../../constants/dashboard';

const flags: Object = {
  'cs-CZ': cz,
  'en-GB': gb,
  'en-US': en,
  'de-DE': de,
};

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
  onNotificationClick: Function,
  storeLocale: Function,
  user: Object,
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
    const [countryCode] = this.props.locale.split('-');

    return (
      <Navbar className={`pt-fixed-top ${light ? '' : 'pt-dark'} topbar`}>
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
                  text="My profile"
                  iconName="info-sign"
                  onClick={() => browserHistory.push('/user')}
                />
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
                text={this.props.user.name}
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
                        label={<img src={flags[loc]} />}
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
                <img src={flags[this.props.locale]} />{' '}
                {countryCode.toUpperCase()}
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
          {data.remote &&
            data.remote.length !== 0 && (
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
            )}
          <ButtonGroup minimal>
            <Button
              iconName="notifications"
              onClick={this.props.onNotificationClick}
            />
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
