import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import pure from 'recompose/onlyUpdateForKeys';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import cs from 'react-intl/locale-data/cs';
import de from 'react-intl/locale-data/de';
import mapProps from 'recompose/mapProps';

import Navigation from 'components/navigation';
import Topbar from '../components/topbar';
import Sidebar from '../components/sidebar';
import Footer from '../components/footer';
import Preloader from '../components/preloader';
import { Manager as ModalManager } from '../components/modal';
import actions from 'store/api/actions';
import { settings } from '../store/ui/actions';
import logo from '../../img/qore_logo.png';
import appSettings from '../settings';
import messages from '../intl/messages';

addLocaleData([...en, ...cs, ...de]);

const systemSelector = state => state.api.system;
const currentUserSelector = state => state.api.currentUser;
const menuSelector = state => state.menu;
const settingsSelector = state => state.ui.settings;

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
    (info, currentUser, stngs, menu) => ({
      info,
      currentUser,
      menu,
      isTablet: stngs.tablet,
    })
  ),
  {
    saveDimensions: settings.saveDimensions,
    fetchSystem: actions.system.fetch,
    fetchSystemOptions: actions.systemOptions.fetch,
    fetchCurrentUser: actions.currentUser.fetch,
    storeSidebar: actions.currentUser.storeSidebar,
    storeTheme: actions.currentUser.storeTheme,
  }
)
@mapProps(
  ({ currentUser, ...rest }): Object => ({
    sidebarOpen: currentUser.sync && currentUser.data.storage.sidebarOpen,
    currentUser,
    ...rest,
  })
)
@pure([
  'info',
  'currentUser',
  'menu',
  'location',
  'children',
  'isTablet',
  'sidebarOpen',
])
export default class Root extends Component {
  static propTypes = {
    children: PropTypes.node,
    menu: PropTypes.object,
    info: PropTypes.object,
    fetchSystem: PropTypes.func,
    saveDimensions: PropTypes.func,
    fetchSystemOptions: PropTypes.func,
    fetchCurrentUser: PropTypes.func,
    location: PropTypes.object,
    currentUser: PropTypes.object,
    isTablet: PropTypes.bool,
    sidebarOpen: PropTypes.bool,
    storeSidebar: PropTypes.func,
  };

  static childContextTypes = {
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
    getTitle: PropTypes.func,
    selectModalText: PropTypes.func,
  };

  /**
   * Initializes internal state.
   *
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this._modal = null;
    this._defaultTitle = '';
  }

  /**
   * Provides modal control function and title.
   *
   * Modal is controlled via `openModal` and `closeModal` functions
   * which delegate to modal manager's open and close respectively.
   *
   * Title computed by {@link titleFromInfo} can be retrieved from
   * `getTitle` to create title hierarchies.
   *
   * @return {object}
   */
  getChildContext() {
    return {
      openModal: (...args) => this._modal.open(...args),
      closeModal: (...args) => this._modal.close(...args),
      getTitle: () => this.titleFromInfo(),
      selectModalText: this.selectCSVContent,
    };
  }

  /**
   * Sets default document title and fetches global data.
   *
   * @see fetchGlobalData
   */
  componentWillMount() {
    this._defaultTitle = document.title;
    this.fetchGlobalData();
  }

  /**
   * Sets computed document title.
   *
   * @see setTitle
   * @see fetchGlobalData
   */
  componentDidMount() {
    this.setTitle();

    // All tests were written for non-responsive sizes
    // ZombieJS automatically sets the innerWidth to 1024
    let width = process.env.TESTINST ? 1600 : window.innerWidth;

    this.props.saveDimensions({
      width,
      height: window.innerHeight,
    });

    window.addEventListener('resize', () => {
      width = process.env.TESTINST ? 1600 : window.innerWidth;

      this.delayedResize({
        width,
        height: window.innerHeight,
      });
    });
  }

  /**
   * Sets document title.
   *
   * @see setTitle
   */
  componentDidUpdate() {
    this.setTitle();
  }

  delayedResize: Function = debounce((data: Object): void => {
    this.props.saveDimensions(data);
  }, 200);

  hideMenu: Function = () => {
    this.setMenu(true);
  };

  showMenu: Function = () => {
    this.setMenu(false);
  };

  toggleMenu: Function = () => {
    this.setMenu(!this.props.sidebarOpen);
  };

  setMenu: Function = (menuCollapsed: boolean) => {
    this.props.storeSidebar(menuCollapsed);
  };

  /**
   * Sets document title from system information.
   *
   * @see titleFromInfo
   */
  setTitle() {
    document.title = this.titleFromInfo();
  }

  selectCSVContent = () => {
    document.getElementById('csv-text').select();
  };

  /**
   * Computes title from system info or uses default title.
   *
   * Default title is read in {@link componentWillMount} from
   * document's title at that time.
   *
   * @return {string}
   */
  titleFromInfo() {
    return this.props.info.sync
      ? `${this.props.info.data['instance-key']} | ` +
          `${this.props.info.data['omq-version']}`
      : this._defaultTitle;
  }

  /**
   * Fetches data used here or by child components.
   */
  fetchGlobalData() {
    this.props.fetchSystem();
    this.props.fetchSystemOptions();
    this.props.fetchCurrentUser();
  }

  /**
   * Stores ref to modal manager to provide control via context.
   *
   * @param {ModalManager} modal
   */
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

  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const { currentUser, info, isTablet } = this.props;
    const locale =
      (currentUser.sync && currentUser.data.storage.locale) || navigator.locale;
    const isLightTheme =
      currentUser.sync && currentUser.data.storage.theme === 'light';

    if (!currentUser.sync || !info.sync) {
      return <Preloader />;
    }

    return (
      <IntlProvider locale={locale} messages={messages(locale)}>
        <div className="root">
          <Topbar
            info={this.props.info}
            locale={locale}
            isTablet={isTablet}
            light={isLightTheme}
            onThemeClick={this.onThemeChange}
          />
          <div className="root__center">
            {!isTablet && (
              <Sidebar
                light={isLightTheme}
                menuCollapsed={this.props.sidebarOpen}
                toggleMenu={this.toggleMenu}
              />
            )}
            <section>
              <div className="container-fluid" id="content-wrapper">
                {this.props.children}
              </div>
            </section>
          </div>
          <Footer
            path={this.props.location.pathname}
            info={this.props.info.data}
          />
          <ModalManager ref={this.refModal} />
        </div>
      </IntlProvider>
    );
  }
}
