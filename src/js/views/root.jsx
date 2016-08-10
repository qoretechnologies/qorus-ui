import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Navigation from 'components/navigation';
import Topbar from 'components/topbar';
import Footer from 'components/footer';
import { Manager as ModalManager } from '../components/modal';

import actions from 'store/api/actions';


const systemSelector = (state) => state.api.system;
const currentUserSelector = (state) => state.api.currentUser;
const menuSelector = (state) => state.menu;


/**
 * Basic layout with global navbar, menu, footer and the main content.
 *
 * It also provides modal dialog via React's context mechanism. It is
 * expected that this component is at the top component hierarchy.
 */
@connect(createSelector(
  systemSelector,
  currentUserSelector,
  menuSelector,
  (info, currentUser, menu) => ({
    info,
    currentUser,
    menu,
  })
))
export default class Root extends Component {
  static propTypes = {
    children: PropTypes.node,
    menu: PropTypes.object,
    info: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
    currentUser: PropTypes.object,
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
  }


  /**
   * Sets document title.
   *
   * @see setTitle
   */
  componentDidUpdate() {
    this.setTitle();
  }


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
    this.props.dispatch(actions.system.fetch());
    this.props.dispatch(actions.systemOptions.fetch());
    this.props.dispatch(actions.currentUser.fetch());
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
    return (
      <div className="root">
        <Topbar
          info={this.props.info.data}
          currentUser={this.props.currentUser.data}
        />
        <div className="root__center">
          <Navigation
            location={this.props.location}
            mainItems={this.props.menu.mainItems}
            extraItems={[]}
          />
          <section>
            <div className="container-fluid">
              {this.props.children}
            </div>
          </section>
        </div>
        <Footer info={this.props.info.data} />
        <ModalManager ref={this.refModal} />
      </div>
    );
  }
}
