// @ts-ignore ts-migrate(2307) FIXME: Cannot find module '@qoretechnologies/reqore' or i... Remove this comment to see the full error message
import { ReqoreColors, ReqoreUIProvider } from '@qoretechnologies/reqore';
import debounce from 'lodash/debounce';
// @flow
import PropTypes from 'prop-types';
import { Component } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import mapProps from 'recompose/mapProps';
import { createSelector } from 'reselect';
import Flex from '../components/Flex';
import FullPageLoading from '../components/FullPageLoading';
import Footer from '../components/footer';
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
import { Sidebar } from './Sidebar';

// eslint-disable-next-line
const consoleError = console.error.bind(console);
// eslint-disable-next-line
/* A workaround for a bug in React Intl. */
console.error = (message, ...args) => {
  const msg = message.toString();

  if (
    msg.startsWith('[React Intl] Missing message:') ||
    msg.startsWith('[React Intl] Cannot format message:') ||
    msg.startsWith('[Blueprint] <Popover> onInteraction') ||
    msg.startsWith('Error: [@formatjs/intl Error MISSING_TRANSLATION]') ||
    msg.startsWith('Warning: [react-router]')
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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'systemOptions' does not exist on type '{... Remove this comment to see the full error message
    fetchSystemOptions: actions.systemOptions.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
    fetchGlobalConfig: actions.system.fetchGlobalConfig,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    fetchCurrentUser: actions.currentUser.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    storeSidebar: actions.currentUser.storeSidebar,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    storeTheme: actions.currentUser.storeTheme,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'health' does not exist on type '{}'.
    fetchHealth: actions.health.fetch,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'system' does not exist on type '{}'.
    fetchDefaultLogger: actions.system.fetchDefaultLogger,
    sendSuccess: success,
    sendWarning: warning,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
    saveFavoriteItems: actions.currentUser.storeFavoriteMenuItem,
  }
)
@mapProps(({ currentUser, ...rest }): any => ({
  sidebarOpen: currentUser.sync && currentUser.data.storage.sidebarOpen,
  currentUser,
  ...rest,
}))
export default class Root extends Component {
  props: {
    children: any;
    info: any;
    fetchSystem: Function;
    saveDimensions: Function;
    fetchSystemOptions: Function;
    fetchCurrentUser: Function;
    location: any;
    currentUser: any;
    health: any;
    isTablet: boolean;
    sidebarOpen: boolean;
    storeSidebar: Function;
    fetchHealth: Function;
    options: any;
    storeTheme: Function;
    sendSuccess: Function;
    sendWarning: Function;
    menu: any;
  } = this.props;

  state = {
    modals: [],
  };

  addModal = (modal) => {
    this.setState((state) => ({
      ...state,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'modals' does not exist on type 'Readonly... Remove this comment to see the full error message
      modals: [...state.modals, modal],
    }));
  };

  removeModal = () => {
    this.setState((state) => {
      // @ts-ignore ts-migrate(2339) FIXME: Property 'modals' does not exist on type 'Readonly... Remove this comment to see the full error message
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'titleFromInfo' does not exist on type 'R... Remove this comment to see the full error message
      getTitle: () => this.titleFromInfo(),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'selectCSVContent' does not exist on type... Remove this comment to see the full error message
      selectModalText: this.selectCSVContent,
    };
  }

  async componentDidMount() {
    await this.fetchGlobalData();
    this.handleResize();
    // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
    window.addEventListener('resize', this.handleResize);

    // add listener for esc key to remove the maximize mode
    window.addEventListener('keyup', (event) => {
      if (event.which === 27) {
        // @ts-ignore ts-migrate(2339) FIXME: Property 'isMaximized' does not exist on type '{ c... Remove this comment to see the full error message
        if (this.props.isMaximized) {
          // @ts-ignore ts-migrate(2339) FIXME: Property 'maximize' does not exist on type '{ chil... Remove this comment to see the full error message
          this.props.maximize();
        }
      }
    });

    if (process.env.NODE_ENV !== 'production') {
      const { sendSuccess, sendWarning } = this.props;

      // @ts-ignore ts-migrate(2339) FIXME: Property '__whmEventSourceWrapper' does not exist ... Remove this comment to see the full error message
      if (window.__whmEventSourceWrapper) {
        // @ts-ignore ts-migrate(2339) FIXME: Property '__whmEventSourceWrapper' does not exist ... Remove this comment to see the full error message
        for (let key of Object.keys(window.__whmEventSourceWrapper)) {
          // @ts-ignore ts-migrate(2339) FIXME: Property '__whmEventSourceWrapper' does not exist ... Remove this comment to see the full error message
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

  delayedResize: Function = debounce((data: any): void => {
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
      // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('system'),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('services'),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('workflows'),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('jobs'),
      // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchDefaultLogger' does not exist on ty... Remove this comment to see the full error message
      this.props.fetchDefaultLogger('remotes', 'remote/datasources'),
    ]);

    this.props.fetchSystemOptions();
    // @ts-ignore ts-migrate(2339) FIXME: Property 'fetchGlobalConfig' does not exist on typ... Remove this comment to see the full error message
    this.props.fetchGlobalConfig();
    this.props.fetchCurrentUser();
    this.props.fetchHealth();
  };

  refModal = (modal) => {
    this._modal = modal;
  };

  onThemeChange: Function = (): void => {
    const { currentUser, storeTheme } = this.props;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
    const theme = currentUser.sync ? currentUser.data.storage.theme || 'dark' : 'dark';

    storeTheme(theme === 'dark' ? 'light' : 'dark');
  };

  render() {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'isMaximized' does not exist on type '{ c... Remove this comment to see the full error message
    const { currentUser, info, isTablet, health, options, menu, isMaximized, maximize, location } =
      this.props;
    const isSynced: boolean =
      // @ts-ignore ts-migrate(2339) FIXME: Property 'sync' does not exist on type 'Object'.
      currentUser.sync && info.sync && health.sync && options.sync && info.globalConfig;

    if (!isSynced) {
      return <FullPageLoading />;
    }

    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const locale = currentUser.data.storage.locale
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
        currentUser.data.storage.locale
      : // @ts-ignore ts-migrate(2339) FIXME: Property 'locale' does not exist on type 'Navigato... Remove this comment to see the full error message
      navigator.locale
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'locale' does not exist on type 'Navigato... Remove this comment to see the full error message
        navigator.locale
      : 'en-US';

    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const { favoriteMenuItems = [] } = currentUser.data.storage;
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const isLightTheme = currentUser.data.storage.theme === 'light';
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    const menuWithPlugins = transformMenu(menu.data, info.data.plugins);

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
                main: isLightTheme ? '#ffffff' : '#333333',
                item: { activeBackground: ReqoreColors.BLUE, activeColor: '#ffffff' },
              },
              header: {
                main: isLightTheme ? '#ffffff' : '#333333',
              },
              footer: {
                main: '#d7d7d7',
              },
              intents: {
                success: '#57801a',
                //danger: '#a11c58',
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
            options={{
              withSidebar: true,
              animations: {
                buttons: false,
                dialogs: false,
              },
            }}
          >
            <div
              className={`root ${isMaximized ? 'maximized' : ''}`}
              style={{ flex: 1, width: '100%' }}
            >
              {!isMaximized && (
                <Topbar
                  onMaximizeClick={maximize}
                  info={info}
                  health={health}
                  locale={locale}
                  isTablet={isTablet}
                  light={isLightTheme}
                  onThemeClick={this.onThemeChange}
                  // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
                  user={currentUser.data}
                  // @ts-ignore ts-migrate(2769) FIXME: No overload matches this call.
                  location={location}
                  sendWarning={this.props.sendWarning}
                />
              )}
              <div className="root__center">
                {!isMaximized && (
                  <Sidebar
                    isCollapsed={this.props.sidebarOpen === false}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message
                    path={this.props.location.pathname}
                    items={menuWithPlugins}
                    bookmarks={transformOldFavoriteItems(favoriteMenuItems)}
                    onCollapseChange={(isCollapsed: boolean) => this.setMenu(!isCollapsed)}
                    // @ts-ignore ts-migrate(2339) FIXME: Property 'saveFavoriteItems' does not exist on typ... Remove this comment to see the full error message
                    onBookmarksChange={this.props.saveFavoriteItems}
                    useNativeTitle
                  />
                )}
                <Flex className="section" scrollX>
                  <Flex style={{ minWidth: 1024 }}>{this.props.children}</Flex>
                </Flex>
              </div>
              {/* @ts-ignore ts-migrate(2339) FIXME: Property 'pathname' does not exist on type 'Object... Remove this comment to see the full error message */}
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
