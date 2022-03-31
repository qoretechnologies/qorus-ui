// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '@qoretechnologies/reqore' or i... Remove this comment to see the full error message
import { ReqoreColors, ReqoreSidebar, ReqoreUIProvider } from '@qoretechnologies/reqore';
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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'systemOptions' does not exist on type '{... Remove this comment to see the full error message
    fetchSystemOptions: actions.systemOptions.fetch,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
    fetchGlobalConfig: actions.system.fetchGlobalConfig,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    fetchCurrentUser: actions.currentUser.fetch,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    storeSidebar: actions.currentUser.storeSidebar,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    storeTheme: actions.currentUser.storeTheme,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'health' does not exist on type '{}'.
    fetchHealth: actions.health.fetch,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
    fetchDefaultLogger: actions.system.fetchDefaultLogger,
    sendSuccess: success,
    sendWarning: warning,
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'modals' does not exist on type 'Readonly... Remove this comment to see the full error message
      modals: [...state.modals, modal],
    }));
  };

  removeModal = () => {
    this.setState((state) => {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'modals' does not exist on type 'Readonly... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'titleFromInfo' does not exist on type 'R... Remove this comment to see the full error message
      getTitle: () => this.titleFromInfo(),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'selectCSVContent' does not exist on type... Remove this comment to see the full error message
      selectModalText: this.selectCSVContent,
    };
  }

  async componentDidMount() {
    await this.fetchGlobalData();
    this.handleResize();
    // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
    window.addEventListener('resize', this.handleResize);

    // add listener for esc key to remove the maximize mode
    window.addEventListener('keyup', (event) => {
      if (event.which === 27) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'isMaximized' does not exist on type '{ c... Remove this comment to see the full error message
        if (this.props.isMaximized) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'maximize' does not exist on type '{ chil... Remove this comment to see the full error message
          this.props.maximize();
        }
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      const { sendSuccess, sendWarning } = this.props;

      // @ts-expect-error ts-migrate(2339) FIXME: Property '__whmEventSourceWrapper' does not exist ... Remove this comment to see the full error message
      if (window.__whmEventSourceWrapper) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property '__whmEventSourceWrapper' does not exist ... Remove this comment to see the full error message
        for (let key of Object.keys(window.__whmEventSourceWrapper)) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property '__whmEventSourceWrapper' does not exist ... Remove this comment to see the full error message
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('system'),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('services'),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('workflows'),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('jobs'),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('remotes', 'remote/datasources'),
    ]);

    this.props.fetchSystemOptions();
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'fetchGlobalConfig' does not exist on typ... Remove this comment to see the full error message
    this.props.fetchGlobalConfig();
    this.props.fetchCurrentUser();
    this.props.fetchHealth();
  };

  refModal = (modal) => {
    this._modal = modal;
  };

  onThemeChange: Function = (): void => {
    const { currentUser, storeTheme } = this.props;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    const theme = currentUser.sync ? currentUser.data.storage.theme || 'dark' : 'dark';

    storeTheme(theme === 'dark' ? 'light' : 'dark');
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isMaximized' does not exist on type '{ c... Remove this comment to see the full error message
    const { currentUser, info, isTablet, health, options, menu, isMaximized, maximize, location } =
      this.props;
    const isSynced: boolean =
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
      currentUser.sync && info.sync && health.sync && options.sync && info.globalConfig;

    if (!isSynced) {
      return <FullPageLoading />;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const locale = currentUser.data.storage.locale
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
      ? currentUser.data.storage.locale
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'locale' does not exist on type 'Navigato... Remove this comment to see the full error message
      : navigator.locale
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'locale' does not exist on type 'Navigato... Remove this comment to see the full error message
      ? navigator.locale
      : 'en-US';

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const { favoriteMenuItems = [] } = currentUser.data.storage;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const isLightTheme = currentUser.data.storage.theme === 'light';
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const menuWithPlugins = transformMenu(menu.data, info.plugins);

    return (
      <IntlProvider messages={messages(locale)} locale={locale}>
        <ModalContext.Provider
          value={{
            addModal: this.addModal,
            removeModal: this.removeModal,
            modals: this.state.modals,
          }}
        >
          <ReqoreUIProvider
            theme={{
              main: '#ffffff',
              sidebar: {
                main: '#383c44',
                item: { activeBackground: ReqoreColors.BLUE },
              },
              header: { main: '#383c44' },
              intents: {
                success: '#7fba27',
                danger: '#e62727',
                pending: '#ffdf34',
                warning: ReqoreColors.ORANGE,
              },
              breadcrumbs: {
                item: {
                  color: '#b9b9b9',
                  activeColor: ReqoreColors.BLUE,
                },
              },
            }}
            withSidebar
          >
            <div className={`root ${isMaximized ? 'maximized' : ''}`} style={{ flex: 1 }}>
              {!isMaximized && (
                <Topbar
                  onMaximizeClick={maximize}
                  info={info}
                  health={health}
                  locale={locale}
                  isTablet={isTablet}
                  light={isLightTheme}
                  onThemeClick={this.onThemeChange}
                  // @ts-expect-error ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
                  user={currentUser.data}
                  // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
                  location={location}
                  sendWarning={this.props.sendWarning}
                />
              )}
              <div className="root__center">
                {!isMaximized && (
                  <ReqoreSidebar
                    isDefaultCollapsed={!this.props.sidebarOpen}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message
                    path={this.props.location.pathname}
                    items={menuWithPlugins}
                    bookmarks={transformOldFavoriteItems(favoriteMenuItems)}
                    // @ts-expect-error ts-migrate(2339) FIXME: Property 'saveFavoriteItems' does not exist on typ... Remove this comment to see the full error message
                    onBookmarksChange={this.props.saveFavoriteItems}
                    wrapperStyle={{ height: 'calc(100% - 30px)' }}
                    useNativeTitle
                  />
                )}
                <Flex className="section" scrollX>
                  <Flex style={{ minWidth: 1024 }}>{this.props.children}</Flex>
                </Flex>
              </div>
              { /* @ts-expect-error ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message */ }
              {!isMaximized && <Footer path={this.props.location.pathname} info={info.data} />}
              <ModalManager />
              <Notifications />
              <Bubbles />
            </div>
          </ReqoreUIProvider>
        </ModalContext.Provider>
      </IntlProvider>
    );
  }
}
