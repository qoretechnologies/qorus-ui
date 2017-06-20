import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import debounce from 'lodash/debounce';
import pure from 'recompose/onlyUpdateForKeys';

import Navigation from 'components/navigation';
import Topbar from '../components/topbar';
import Footer from '../components/footer';
import Preloader from '../components/preloader';
import { Manager as ModalManager } from '../components/modal';
import actions from 'store/api/actions';
import { settings } from '../store/ui/actions';

const systemSelector = (state) => state.api.system;
const currentUserSelector = (state) => state.api.currentUser;
const menuSelector = (state) => state.menu;
const settingsSelector = (state) => state.ui.settings;

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
    }),
  ),
  {
    saveDimensions: settings.saveDimensions,
    fetchSystem: actions.system.fetch,
    fetchSystemOptions: actions.systemOptions.fetch,
    fetchCurrentUser: actions.currentUser.fetch,
  }
)
@pure([
  'info',
  'currentUser',
  'menu',
  'location',
  'children',
  'isTablet',
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

  state: {
    showMenu: boolean,
  } = {
    showMenu: this.props.isTablet,
  };


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
    const width = process.env.TESTINST ? 1600 : window.innerWidth;

    this.props.saveDimensions({
      width,
      height: window.innerHeight,
    });

    window.addEventListener('resize', () => {
      this.delayedResize({
        width,
        height: window.innerHeight,
      });
    });
  }

  componentWillReceiveProps(nextProps: Object): void {
    if (!nextProps.isTablet) {
      this.showMenu();
    }
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
    this.setMenu(false);
  };

  showMenu: Function = () => {
    this.setMenu(true);
  };

  toggleMenu: Function = () => {
    this.setMenu(!this.state.showMenu);
  };

  setMenu: Function = (showMenu: bool) => {
    this.setState({
      showMenu,
    });
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
    return this.props.info.sync ?
      (`${this.props.info.data['instance-key']} | ` +
       `${this.props.info.data['omq-version']}`) :
      this._defaultTitle;
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
  refModal = (modal) => {
    this._modal = modal;
  };


  /**
   * Returns element for this component.
   *
   * @return {ReactElement}
   */
  render() {
    const { currentUser, info } = this.props;

    if (!currentUser.sync || !info.sync) {
      return <Preloader />;
    }

    return (
      <div className="root">
        <Topbar
          info={this.props.info.data}
          currentUser={this.props.currentUser.data}
          onMenuToggle={this.toggleMenu}
          isTablet={this.props.isTablet}
          showMenu={this.state.showMenu}
        />
        <div className="root__center">
          {this.state.showMenu && (
            <Navigation
              location={this.props.location}
              mainItems={this.props.menu.mainItems}
              extraItems={[]}
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
    );
  }
}
