import {
  Button,
  ButtonGroup,
  Classes,
  ControlGroup,
  InputGroup,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import map from 'lodash/map';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cz from '../../../img/country_flags/cz.jpg';
import jp from '../../../img/country_flags/jp.png';
import en from '../../../img/country_flags/us.png';
import logo from '../../../img/qorus_engine_logo.png';
import whiteLogo from '../../../img/qorus_engine_logo_white.png';
import { Control } from '../../components/controls';
import { HEALTH_KEYS } from '../../constants/dashboard';
import Release from '../../containers/release';
import withModal from '../../hocomponents/modal';
import withPane from '../../hocomponents/pane';
import { LANGS } from '../../intl/messages';
import settings from '../../settings';
import actions from '../../store/api/actions';
import Notifications from '../notifications';

const flags: Object = {
  'cs-CZ': cz,
  'en-US': en,
  'ja-JP': jp,
};

const searchableViews = {
  'global.in-workflows': 'workflows?',
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
@injectIntl
export default class Topbar extends Component {
  props: Props = this.props;

  state: {
    quickSearchType: string,
    quickSearchValue: string,
  } = {
    quickSearchType: 'Orders by value',
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
            {sortedInterfaces.map((key: string): React.Element<MenuItem> => (
              <MenuItem
                text={key}
                key={key}
                onClick={() => this.setState({ quickSearchType: key })}
              />
            ))}
          </Menu>
        }
        popoverClassName="popover-dropdown"
        position={Position.BOTTOM}
      >
        <Button
          className={Classes.MINIMAL}
          text={this.props.intl.formatMessage(
            { id: 'system.global-search-type' },
            {
              type: this.props.intl.formatMessage({
                id: this.state.quickSearchType,
              }),
            }
          )}
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
      info,
      onMaximizeClick,
      sendWarning,
      intl,
    } = this.props;

    const [countryCode] = this.props.locale.split('-');

    return (
      <Navbar className={`bp3-fixed-top ${light ? '' : 'bp3-dark'} topbar`}>
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
                placeholder={intl.formatMessage({
                  id: 'system.global-search',
                })}
                rightElement={this.renderSearchMenu()}
                value={this.state.quickSearchValue}
                onChange={(e) =>
                  this.setState({ quickSearchValue: e.target.value })
                }
              />
              <Control icon="search" type="submit" big />
            </ControlGroup>
          </form>
          <NavbarDivider />
          <ButtonGroup minimal>
            <Button
              icon="git-push"
              onClick={() => {
                this.props.openModal(
                  <Release onClose={this.props.closeModal} />
                );
              }}
            />
          </ButtonGroup>
          <NavbarDivider />
          <Popover
            position={Position.BOTTOM}
            useSmartPositioning
            content={
              <Menu>
                <MenuDivider title={this.props.user.name} />
                <MenuItem
                  text="My profile"
                  icon="info-sign"
                  onClick={() => browserHistory.push('/user')}
                />
                <MenuItem
                  text="Logout"
                  icon="log-out"
                  onClick={() => browserHistory.push('/logout')}
                />
              </Menu>
            }
          >
            <ButtonGroup minimal>
              <Button icon="user" />
            </ButtonGroup>
          </Popover>
          {settings.IS_HTTP && (
            <ButtonGroup minimal>
              <Tooltip
                intent={Intent.DANGER}
                content="You are currently using this site via an insecure connection.Some functionality requiring a secure connection will not be available."
                position={Position.LEFT}
              >
                <Button icon="warning-sign" intent={Intent.DANGER} />
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
              <Button icon="build" intent={HEALTH_KEYS[data.health]} />
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
                <Button icon="share" />
              </Popover>
            </ButtonGroup>
          )}
          <ButtonGroup minimal>
            <Button
              icon="notifications"
              intent={
                this.props.notificationStatus ? Intent.NONE : Intent.PRIMARY
              }
              onClick={this.handleNotificationsClick}
              id="notificationsToggle"
            />
          </ButtonGroup>
          <NavbarDivider />
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
                        label={
                          <img
                            src={flags[loc]}
                            style={{ width: 16, height: 12 }}
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
                  src={flags[this.props.locale]}
                  style={{ width: 16, height: 12 }}
                />
              </Button>
            </ButtonGroup>
          </Popover>
          <ButtonGroup minimal>
            <Button
              icon="maximize"
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
              icon={light ? 'moon' : 'flash'}
              onClick={onThemeClick}
              id="themeToggle"
            />
          </ButtonGroup>
        </NavbarGroup>
      </Navbar>
    );
  }
}
