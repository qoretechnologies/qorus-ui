import { QorusSidebar, ReqoreUIProvider } from '@qoretechnologies/reqore';
import debounce from 'lodash/debounce';
// @flow
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import cs from 'react-intl/locale-data/cs';
import en from 'react-intl/locale-data/en';
import ja from 'react-intl/locale-data/ja';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import Flex from '../components/Flex';
import Footer from '../components/footer';
import FullPageLoading from '../components/FullPageLoading';
import { Manager as ModalManager } from '../components/modal';
import Topbar from '../components/topbar';
import Bubbles from '../containers/bubbles';
import Notifications from '../containers/notifications';
import { ModalContext } from '../context/modal';
import { transformMenu, transformOldFavoriteItems } from '../helpers/system';
import messages from '../intl/messages';
import actions from '../store/api/actions';
import { settings } from '../store/ui/actions';
import { success, warning } from '../store/ui/bubbles/actions';

// eslint-disable-next-line
const consoleError = console.error.bind(console);
// eslint-disable-next-line
console.error = (message, ...args) => {
  if (
    typeof message === 'string' &&
    (message.startsWith('[React Intl] Missing message:') ||
      message.startsWith('[React Intl] Cannot format message:') ||
      message.startsWith('[Blueprint] <Popover> onInteraction') ||
      message.startsWith('Warning: [react-router]'))
  ) {
    return;
  }
  consoleError(message, ...args);
};

// eslint-disable-next-line
const consoleWarn = console.warn.bind(console);
// eslint-disable-next-line
console.warn = (message, ...args) => {
  if (
    typeof message === 'string' &&
    (message.startsWith('[Blueprint] <Popover> onInteraction') ||
      message.startsWith("[Violation] 'setTimeout' handler "))
  ) {
    return;
  }
  consoleWarn(message, ...args);
};

addLocaleData([...en, ...cs, ...ja]);
const systemSelector = (state) => state.api.system;
const currentUserSelector = (state) => state.api.currentUser;
const menuSelector = (state) => state.ui.menu;
const settingsSelector = (state) => state.ui.settings;
const healthSelector = (state) => state.api.health;
const optionsSelector = (state) => state.api.systemOptions;

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
      isMaximized: stngs.isMaximized,
      health,
      options,
    })
  ),
  {
    saveDimensions: settings.saveDimensions,
    maximize: settings.maximize,
    fetchSystemOptions: actions.systemOptions.fetch,
    fetchGlobalConfig: actions.system.fetchGlobalConfig,
    fetchCurrentUser: actions.currentUser.fetch,
    storeSidebar: actions.currentUser.storeSidebar,
    storeTheme: actions.currentUser.storeTheme,
    fetchHealth: actions.health.fetch,
    fetchDefaultLogger: actions.system.fetchDefaultLogger,
    sendSuccess: success,
    sendWarning: warning,
    saveFavoriteItems: actions.currentUser.storeFavoriteMenuItem,
  }
)
@mapProps(({ currentUser, ...rest }): Object => ({
  sidebarOpen: currentUser.sync && currentUser.data.storage.sidebarOpen,
  currentUser,
  ...rest,
}))
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

  state = {
    modals: [],
  };

  addModal = (modal) => {
    this.setState((state) => ({
      ...state,
      modals: [...state.modals, modal],
    }));
  };

  removeModal = () => {
    this.setState((state) => {
      const modals = [...state.modals];

      modals.pop();

      return {
        ...state,
        modals,
      };
    });
  };

  static childContextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    getTitle: PropTypes.func,
    selectModalText: PropTypes.func,
  };

  _modal = null;

  getChildContext() {
    return {
      openModal: (...args) => this._modal.open(...args),
      closeModal: (...args) => this._modal.close(...args),
      getTitle: () => this.titleFromInfo(),
      selectModalText: this.selectCSVContent,
    };
  }

  async componentDidMount() {
    await this.fetchGlobalData();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    // add listener for esc key to remove the maximize mode
    window.addEventListener('keyup', (event) => {
      if (event.which === 27) {
        if (this.props.isMaximized) {
          this.props.maximize();
        }
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      const { sendSuccess, sendWarning } = this.props;

      if (window.__whmEventSourceWrapper) {
        for (let key of Object.keys(window.__whmEventSourceWrapper)) {
          window.__whmEventSourceWrapper[key].addMessageListener((msg) => {
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

  fetchGlobalData = async () => {
    await Promise.all([
      this.props.fetchDefaultLogger('system'),
      this.props.fetchDefaultLogger('services'),
      this.props.fetchDefaultLogger('workflows'),
      this.props.fetchDefaultLogger('jobs'),
      this.props.fetchDefaultLogger('remotes', 'remote/datasources'),
    ]);

    this.props.fetchSystemOptions();
    this.props.fetchGlobalConfig();
    this.props.fetchCurrentUser();
    this.props.fetchHealth();
  };

  refModal = (modal) => {
    this._modal = modal;
  };

  onThemeChange: Function = (): void => {
    const { currentUser, storeTheme } = this.props;
    const theme = currentUser.sync
      ? currentUser.data.storage.theme || 'dark'
      : 'dark';

    storeTheme(theme === 'dark' ? 'light' : 'dark');
  };

  render() {
    const {
      currentUser,
      info,
      isTablet,
      health,
      options,
      menu,
      isMaximized,
      maximize,
      location,
    } = this.props;
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
    const menuWithPlugins = transformMenu(menu.data, info.plugins);

    return (
      <IntlProvider messages={messages(locale)} locale={locale}>
        <ReqoreUIProvider theme={{ main: isLightTheme ? '#fff' : '#383c44' }}>
          <ModalContext.Provider
            value={{
              addModal: this.addModal,
              removeModal: this.removeModal,
              modals: this.state.modals,
            }}
          >
            <div className={`root ${isMaximized && 'maximized'}`}>
              {!isMaximized && (
                <Topbar
                  onMaximizeClick={maximize}
                  info={info}
                  health={health}
                  locale={locale}
                  isTablet={isTablet}
                  light={isLightTheme}
                  onThemeClick={this.onThemeChange}
                  user={currentUser.data}
                  location={location}
                  sendWarning={this.props.sendWarning}
                />
              )}
              <div className="root__center">
                {!isMaximized && (
                  <QorusSidebar
                    isDefaultCollapsed={!this.props.sidebarOpen}
                    path={this.props.location.pathname}
                    items={menuWithPlugins}
                    bookmarks={transformOldFavoriteItems(favoriteMenuItems)}
                    onBookmarksChange={this.props.saveFavoriteItems}
                    wrapperStyle={{ height: 'calc(100% - 30px)' }}
                  />
                )}
                <Flex className="section" scrollX>
                  <Flex style={{ minWidth: 1024 }}>{this.props.children}</Flex>
                </Flex>
              </div>
              {!isMaximized && (
                <Footer path={this.props.location.pathname} info={info.data} />
              )}
              <ModalManager />
              <Notifications />
              <Bubbles />
            </div>
          </ModalContext.Provider>
        </ReqoreUIProvider>
      </IntlProvider>
    );
  }
}
