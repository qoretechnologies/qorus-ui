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
  InputGroup,
  ControlGroup,
  Classes,
} from '@blueprintjs/core';
import map from 'lodash/map';

import de from '../../../img/country_flags/de.png';
import gb from '../../../img/country_flags/gb.png';
import cz from '../../../img/country_flags/cz.png';
import en from '../../../img/country_flags/us.png';

import withModal from '../../hocomponents/modal';
import withPane from '../../hocomponents/pane';
import logo from '../../../img/qore_logo.png';
import actions from '../../store/api/actions';
import { LANGS } from '../../intl/messages';
import settings from '../../settings';
import { HEALTH_KEYS } from '../../constants/dashboard';
import Notifications from '../notifications';

const flags: Object = {
  'cs-CZ': cz,
  'en-GB': gb,
  'en-US': en,
  'de-DE': de,
};

const searchableViews = {
  Workflows: 'workflows?',
  Services: 'services?',
  Jobs: 'jobs?',
  Groups: 'groups?',
  ['Ongoing Alerts']: 'system/alerts?',
  ['Transient Alerts']: 'system/alerts?tab=transient&',
  Options: 'system/options?',
  Datasources: 'system/remote?',
  ['User Connections']: 'system/remote?tab=user&',
  ['Qorus Connections']: 'system/remote?tab=qorus&',
  Properties: 'system/props?',
  SLAs: 'system/slas?',
  Users: 'system/rbac?',
  Roles: 'system/rbac?tab=roles&',
  Permissions: 'system/rbac?tab=permissions&',
  Errors: 'system/errors?',
  ['SQL Cache']: 'system/sqlcache?',
  ['Value Maps']: 'system/values?',
  ['Code Library']: 'library?',
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
  openPane: Function,
  notificationStatus: boolean,
};

/**
 * Display info about Qorus instance and logged in user.
 */
@connect(
  (state: Object): Object => ({
    notificationStatus: state.ui.notifications.read,
  }),
  {
    storeLocale: actions.currentUser.storeLocale,
  }
)
@withModal()
@withPane(Notifications, null, 'all', 'notifications', 'notificationsPane')
export default class Topbar extends Component {
  props: Props;

  state: {
    quickSearchType: string,
    quickSearchValue: string,
  } = {
    quickSearchType: 'Workflows',
    quickSearchValue: '',
  };

  handleNotificationsClick: Function = () => {
    this.props.openPane();
  };

  handleSubmit: Function = (e: Object): void => {
    e.preventDefault();

    browserHistory.push(
      `/${searchableViews[this.state.quickSearchType]}search=${
        this.state.quickSearchValue
      }`
    );
  };

  renderSearchMenu: Function = () => {
    const interfaces: Array<string> = Object.keys(searchableViews);
    const sortedInterfaces: Array<string> = interfaces.sort();

    return (
      <Popover
        content={
          <Menu>
            {sortedInterfaces.map(
              (key: string): React.Element<MenuItem> => (
                <MenuItem
                  text={key}
                  onClick={() => this.setState({ quickSearchType: key })}
                />
              )
            )}
          </Menu>
        }
        position={Position.BOTTOM}
      >
        <Button
          className={Classes.MINIMAL}
          text={`in ${this.state.quickSearchType}`}
          rightIconName="caret-down"
        />
      </Popover>
    );
  };

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
          <form onSubmit={this.handleSubmit}>
            <InputGroup
              leftIconName="search"
              placeholder="Quick search"
              rightElement={this.renderSearchMenu()}
              value={this.state.quickSearchValue}
              onChange={e =>
                this.setState({ quickSearchValue: e.target.value })
              }
            />
          </form>
          <NavbarDivider />
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
          {settings.PROTOCOL === 'http' && (
            <ButtonGroup minimal>
              <Tooltip
                intent={Intent.DANGER}
                content="You are currently using this site via an insecure connection.Some functionality requiring a secure connection will not be available."
                position={Position.LEFT}
              >
                <Button iconName="warning-sign" intent={Intent.DANGER} />
              </Tooltip>
            </ButtonGroup>
          )}
          <ButtonGroup minimal>
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
              <Button iconName="build" intent={Intent.WARNING} />
            </Popover>
          </ButtonGroup>
          {data.remote &&
            data.remote.length !== 0 && (
              <ButtonGroup minimal>
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
                  <Button iconName="share" />
                </Popover>
              </ButtonGroup>
            )}
          <ButtonGroup minimal>
            <Button
              iconName="notifications"
              intent={
                this.props.notificationStatus ? Intent.NONE : Intent.PRIMARY
              }
              onClick={this.handleNotificationsClick}
            />
          </ButtonGroup>
          <NavbarDivider />
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
