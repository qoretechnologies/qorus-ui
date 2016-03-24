import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// import { get, flowRight, curry } from 'lodash';
// import { compare } from 'utils';
import goTo from 'routes';

// data
import actions from 'store/api/actions';

// components
import Loader from 'components/loader';
import Pane from 'components/pane';

const servicesSelector = state => state.api.services;


const viewSelector = createSelector(
  [
    servicesSelector,
  ],
  (services) => ({
    sync: services.sync,
    loading: services.loading,
    services,
  })
);

const ServicesToolbar = () => <p>Services toolbar</p>;
const ServicesTable = () => <p>Services table</p>;


@connect(viewSelector)
export default class Services extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    services: PropTypes.array,
    info: PropTypes.object,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    params: PropTypes.object,
    route: PropTypes.object,
  };


  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };


  static childContextTypes = {
    params: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func,
  };


  getChildContext() {
    return {
      params: this.props.params,
      route: this.props.route,
      dispatch: this.props.dispatch,
    };
  }


  componentWillMount() {
    this.props.dispatch(actions.services.fetch());
  }


  componentDidMount() {
    this.setTitle();
  }


  componentDidUpdate() {
    this.setTitle();
  }


  onClosePane() {
    goTo(
      this.context.router,
      'serrvices',
      this.props.route.path,
      this.props.params,
      { detailId: null, tabId: null }
    );
  }


  setTitle() {
    document.title = `Services | ${this.context.getTitle()}`;
  }


  getActiveRow() {
    if (!this.props.params.detailId) return null;

    return this.props.services.find(::this.isActive);
  }


  isActive(row) {
    return row.id === parseInt(this.props.params.detailId, 10);
  }


  renderPane() {
    // const { params } = this.props;

    if (!this.getActiveRow()) return null;

    return (
      <Pane
        width={550}
        onClose={::this.onClosePane}
      >
        <h3>Test</h3>
      </Pane>
    );
  }


  render() {
    const { sync, loading, services } = this.props;

    if (!sync || loading) {
      return <Loader />;
    }

    return (
      <div>
        <ServicesToolbar />
        <ServicesTable
          services={services}
          activeRowId={parseInt(this.props.params.detailId, 10)}
        />
        {this.renderPane()}
      </div>
    );
  }
}
