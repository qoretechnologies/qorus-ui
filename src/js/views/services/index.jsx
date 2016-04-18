import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// import { get, flowRight, curry } from 'lodash';
// import { compare } from 'utils';
import { goTo } from '../../helpers/router';

// data
import actions from 'store/api/actions';

// components
import Loader from 'components/loader';
import Pane from 'components/pane';

import ServicesTable from './table';
import ServicesDetail from './detail';

const servicesSelector = state => state.api.services;

const systemOptionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.service)
);

const viewSelector = createSelector(
  [
    servicesSelector,
    systemOptionsSelector,
  ],
  (services, systemOptions) => ({
    sync: services.sync,
    loading: services.loading,
    services: services.data,
    systemOptions,
  })
);

const ServicesToolbar = () => <p>Services toolbar</p>;


@connect(viewSelector)
export default class Services extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    services: PropTypes.array,
    info: PropTypes.object,
    systemOptions: PropTypes.array,
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
      'services',
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
    const { params, systemOptions } = this.props;

    if (!this.getActiveRow()) return null;

    return (
      <Pane
        width={550}
        onClose={::this.onClosePane}
      >
        <ServicesDetail
          service={this.getActiveRow()}
          systemOptions={systemOptions}
          tabId={params.tabId}
        />
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
          collection={services}
          activeRowId={parseInt(this.props.params.detailId, 10)}
        />
        {this.renderPane()}
      </div>
    );
  }
}
