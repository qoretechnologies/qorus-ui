// @flow
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import pure from 'recompose/onlyUpdateForKeys';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import cs from 'react-intl/locale-data/cs';
import de from 'react-intl/locale-data/de';
import mapProps from 'recompose/mapProps';

import Topbar from '../components/topbar';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';
import { Manager as ModalManager } from '../components/modal';
import actions from '../store/api/actions';
import { settings } from '../store/ui/actions';
import messages from '../intl/messages';
import Bubbles from '../containers/bubbles';
import Notifications from '../containers/notifications';
import Flex from '../components/Flex';
import { success, warning } from '../store/ui/bubbles/actions';
import FullPageLoading from '../components/FullPageLoading';

addLocaleData([...en, ...cs, ...de]);
const systemSelector = state => state.api.system;
const currentUserSelector = state => state.api.currentUser;
const menuSelector = state => state.ui.menu;
const settingsSelector = state => state.ui.settings;
const healthSelector = state => state.api.health;
const optionsSelector = state => state.api.systemOptions;

/**
 * Basic layout with global navbar, menu, footer and the main content.
 *
 * It also provides modal dialog via React's context mechanism. It is
 * expected that this component is at the top component hierarchy.
 */
@connect(
  createSelector(
    systemSelector,
    currentUserSelector,
    settingsSelector,
    menuSelector,
    healthSelector,
    optionsSelector,
    (info, currentUser, stngs, menu, health, options) => ({
      info,
      currentUser,
      menu,
      isTablet: stngs.tablet,
      health,
      options,
    })
  ),
  {
    saveDimensions: settings.saveDimensions,
    fetchSystem: actions.system.fetch,
    fetchSystemOptions: actions.systemOptions.fetch,
    fetchGlobalConfig: actions.system.fetchGlobalConfig,
    fetchCurrentUser: actions.currentUser.fetch,
    storeSidebar: actions.currentUser.storeSidebar,
    storeTheme: actions.currentUser.storeTheme,
    fetchHealth: actions.health.fetch,
    sendSuccess: success,
    sendWarning: warning,
  }
)
@mapProps(
  ({ currentUser, ...rest }): Object => ({
    sidebarOpen: currentUser.sync && currentUser.data.storage.sidebarOpen,
    currentUser,
    ...rest,
  })
)
export default class Root extends Component {
  props: {
    children: any,
    info: Object,
    fetchSystem: Function,
    saveDimensions: Function,
    fetchSystemOptions: Function,
    fetchCurrentUser: Function,
    location: Object,
    currentUser: Object,
    health: Object,
    isTablet: boolean,
    sidebarOpen: boolean,
    storeSidebar: Function,
    fetchHealth: Function,
    options: Object,
    storeTheme: Function,
    sendSuccess: Function,
    sendWarning: Function,
    menu: Object,
  } = this.props;

  static childContextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    getTitle: PropTypes.func,
    selectModalText: PropTypes.func,
  };

  _modal = null;

  getChildContext () {
    return {
      openModal: (...args) => this._modal.open(...args),
      closeModal: (...args) => this._modal.close(...args),
      getTitle: () => this.titleFromInfo(),
      selectModalText: this.selectCSVContent,
    };
  }

  componentDidMount () {
    this.fetchGlobalData();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    if (process.env.NODE_ENV !== 'production') {
      const { sendSuccess, sendWarning } = this.props;

      if (window.__whmEventSourceWrapper) {
        for (let key of Object.keys(window.__whmEventSourceWrapper)) {
          window.__whmEventSourceWrapper[key].addMessageListener(msg => {
            if (typeof msg.data === 'string' && msg.data.startsWith('{')) {
              const data = JSON.parse(msg.data);

              if (data && data.action) {
                switch (data.action) {
                  case 'building':
                    sendWarning('Webpack rebuilding...', 'webpack-build');
                    break;
                  case 'built':
                    sendSuccess('Webpack rebuilt!', 'webpack-build');
                    break;
                }
              }
            }
          });
        }
      }
    }
  }

  delayedResize: Function = debounce((data: Object): void => {
    this.props.saveDimensions(data);
  }, 100);

  handleResize: Function = () => {
    this.props.saveDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  hideMenu: Function = () => {
    this.setMenu(false);
  };

  showMenu: Function = () => {
    this.setMenu(true);
  };

  toggleMenu: Function = () => {
    this.setMenu(!this.props.sidebarOpen);
  };

  setMenu: Function = (sidebarOpen: boolean) => {
    this.props.storeSidebar(sidebarOpen);
  };

  fetchGlobalData () {
    this.props.fetchSystem();
    this.props.fetchSystemOptions();
    this.props.fetchGlobalConfig();
    this.props.fetchCurrentUser();
    this.props.fetchHealth();
  }

  refModal = modal => {
    this._modal = modal;
  };

  onThemeChange: Function = (): void => {
    const { currentUser, storeTheme } = this.props;
    const theme = currentUser.sync
      ? currentUser.data.storage.theme || 'dark'
      : 'dark';

    storeTheme(theme === 'dark' ? 'light' : 'dark');
  };

  render () {
    const { currentUser, info, isTablet, health, options, menu } = this.props;
    const isSynced: boolean =
      currentUser.sync &&
      info.sync &&
      health.sync &&
      options.sync &&
      info.globalConfig;

    if (!isSynced) {
      return <FullPageLoading />;
    }

    const locale = currentUser.data.storage.locale
      ? currentUser.data.storage.locale
      : navigator.locale
        ? navigator.locale
        : 'en-US';

    const { favoriteMenuItems = [] } = currentUser.data.storage;
    const isLightTheme = currentUser.data.storage.theme === 'light';

    return (
      <div className="root">
        <Topbar
          info={info}
          health={health}
          locale={locale}
          isTablet={isTablet}
          light={isLightTheme}
          onThemeClick={this.onThemeChange}
          user={currentUser.data}
          location={this.props.location}
        />
        <div className="root__center">
          <Sidebar
            isLight={isLightTheme}
            isCollapsed={!this.props.sidebarOpen}
            toggleMenu={this.toggleMenu}
            isTablet={isTablet}
            location={this.props.location}
            menu={menu.data}
            favoriteItems={favoriteMenuItems}
          />
          <Flex className="section" scrollX>
            <Flex style={{ minWidth: 1024 }}>{this.props.children}</Flex>
          </Flex>
        </div>
        <Footer path={this.props.location.pathname} info={info.data} />
        <ModalManager ref={this.refModal} />
        <Notifications />
        <Bubbles />
      </div>
    );
  }
}
