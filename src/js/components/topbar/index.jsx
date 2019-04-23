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
  Classes,
  Icon,
  ControlGroup,
} from '@blueprintjs/core';
import { Controls, Control } from '../../components/controls';
import map from 'lodash/map';

import de from '../../../img/country_flags/de.png';
import gb from '../../../img/country_flags/gb.png';
import cz from '../../../img/country_flags/cz.png';
import en from '../../../img/country_flags/us.png';

import withModal from '../../hocomponents/modal';
import withPane from '../../hocomponents/pane';
import logo from '../../../img/qorus_engine_logo.png';
import whiteLogo from '../../../img/qorus_engine_logo_white.png';
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
  'Ongoing Alerts': 'system/alerts?',
  'Transient Alerts': 'system/alerts?tab=transient&',
  Options: 'system/options?',
  Datasources: 'remote?',
  'User Connections': 'remote?tab=user&',
  'Qorus Connections': 'remote?tab=qorus&',
  Properties: 'system/props?',
  SLAs: 'slas?',
  Users: 'rbac?',
  Roles: 'rbac?tab=roles&',
  Permissions: 'rbac?tab=permissions&',
  Errors: 'errors?',
  'SQL Cache': 'system/sqlcache?',
  'Value Maps': 'values?',
  'Code Library': 'library?',
  'Orders by ID': {
    link: 'search?',
    queryName: 'ids',
  },
  'Orders by value': {
    link: 'search?',
    queryName: 'keyvalue',
  },
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
  storeLocale: Function,
  user: Object,
  openPane: Function,
  notificationStatus: boolean,
  onMaximizeClick: Function,
};

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
  props: Props = this.props;

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

    const { quickSearchType, quickSearchValue } = this.state;
    const searchable = searchableViews[quickSearchType];
    const link: string =
      typeof searchable === 'object' ? searchable.link : searchable;
    const queryName: string =
      typeof searchable === 'object' ? searchable.queryName : 'search';

    browserHistory.push(`/${link}${queryName}=${quickSearchValue}`);
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
                  key={key}
                  onClick={() => this.setState({ quickSearchType: key })}
                />
              )
            )}
          </Menu>
        }
        popoverClassName="popover-dropdown"
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

  render () {
    const {
      light,
      onThemeClick,
      health: { data },
      info,
      onMaximizeClick,
      sendWarning,
    } = this.props;
    const [countryCode] = this.props.locale.split('-');

    return (
      <Navbar className={`pt-fixed-top ${light ? '' : 'pt-dark'} topbar`}>
        <NavbarGroup>
          <NavbarHeading>
            <img src={light ? logo : whiteLogo} className="qore-small-logo" />
            <span className="topbar-instance-on">on</span>
            <span className="topbar-instance">{info.data['instance-key']}</span>
          </NavbarHeading>
        </NavbarGroup>
        <NavbarGroup align="right">
          <form onSubmit={this.handleSubmit} id="quickSearchForm">
            <ControlGroup>
              <InputGroup
                id="quickSearch"
                lefticonName="search"
                placeholder="Quick search"
                rightElement={this.renderSearchMenu()}
                value={this.state.quickSearchValue}
                onChange={e =>
                  this.setState({ quickSearchValue: e.target.value })
                }
              />
              <Control icon="search" type="submit" big />
            </ControlGroup>
          </form>
          <NavbarDivider />
          <Popover
            position={Position.BOTTOM}
            useSmartPositioning
            content={
              <Menu>
                <MenuDivider title={this.props.user.name} />
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
              <Button iconName="user" />
            </ButtonGroup>
          </Popover>
          {settings.IS_HTTP && (
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
                    text="Status"
                    label={data.health}
                    intent={HEALTH_KEYS[data.health]}
                  />
                  <MenuItem text="Ongoing alerts" label={data.ongoing} />
                  <MenuItem text="Transient alerts" label={data.transient} />
                </Menu>
              }
            >
              <Button iconName="build" intent={HEALTH_KEYS[data.health]} />
            </Popover>
          </ButtonGroup>
          {data.remote && data.remote.length !== 0 && (
            <ButtonGroup minimal>
              <Popover
                position={Position.BOTTOM_RIGHT}
                content={
                  <Menu>
                    <MenuDivider title="Remote connections" />
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
              id="notificationsToggle"
            />
          </ButtonGroup>
          <NavbarDivider />
          {/* <Popover
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
                <img src={flags[this.props.locale]} />
              </Button>
            </ButtonGroup>
          </Popover> */}
          <ButtonGroup minimal>
            <Button
              iconName="maximize"
              onClick={() => {
                sendWarning(
                  'Full screen mode activated. Press [ESC] to leave.',
                  'fullscreen'
                );
                onMaximizeClick();
              }}
              id="maximize"
            />
          </ButtonGroup>
          <ButtonGroup minimal>
            <Button
              iconName={light ? 'moon' : 'flash'}
              onClick={onThemeClick}
              id="themeToggle"
            />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }
}
