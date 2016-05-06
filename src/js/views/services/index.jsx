import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { setTitle } from '../../helpers/document';

// data
import actions from 'store/api/actions';
import * as ui from 'store/ui/actions';

// components
import Loader from 'components/loader';
import Pane from 'components/pane';

import ServicesToolbar from './toolbar';
import ServicesTable from './table';
import ServicesDetail from './detail';

import { findBy } from '../../helpers/search';
import { flowRight } from 'lodash';
import firstBy from 'thenby';

const sortServices = (sortData) => (services) => services.slice().sort(
  firstBy(w => w[sortData.sortBy], sortData.sortByKey)
    .thenBy(w => w[sortData.historySortBy], sortData.historySortByKey)
  );

const filterSearch = (search) => (services) =>
  findBy('name', search, services);

const servicesSelector = state => state.api.services;

const systemOptionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.service)
);

const sortSelector = state => state.ui.services;
const searchSelector = (state, props) => props.location.query.q;

const collectionSelector = createSelector(
  [
    sortSelector,
    searchSelector,
    servicesSelector,
  ],
  (sortData, search, services) => flowRight(
    sortServices(sortData),
    filterSearch(search)
  )(services.data)
);

const viewSelector = createSelector(
  [
    servicesSelector,
    systemOptionsSelector,
    collectionSelector,
    sortSelector,
  ],
  (services, systemOptions, collection, sortData) => ({
    sync: services.sync,
    loading: services.loading,
    services: collection,
    systemOptions,
    sortData,
  })
);

@connect(viewSelector)
export default class Services extends Component {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    services: PropTypes.array,
    info: PropTypes.object,
    systemOptions: PropTypes.array,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    params: PropTypes.object,
    route: PropTypes.object,
    onPaneClose: PropTypes.func,
    getActiveRow: PropTypes.func,
    onFilterClick: PropTypes.func,
    filterFn: PropTypes.func,
    onSearchChange: PropTypes.func,
    clearSelection: PropTypes.func,
    onDataFilterChange: PropTypes.func,
    setSelectedData: PropTypes.func,
    onBatchAction: PropTypes.func,
    selectedData: PropTypes.object,
    selected: PropTypes.string,
    onAllClick: PropTypes.func,
    onNoneClick: PropTypes.func,
    onInvertClick: PropTypes.func,
    onCSVClick: PropTypes.func,
    sortData: PropTypes.object,
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
    setTitle(`Services | ${this.context.getTitle()}`);
  }

  componentDidUpdate() {
    setTitle(`Services | ${this.context.getTitle()}`);
  }

  handleCSVClick = () => {
    this.props.onCSVClick(this.props.services, 'services');
  };

  /**
   * Handles the batch action calls like
   * enabling, disabling, reseting etc
   * of multiple workflows
   *
   * @param {String} type
   */
  handleBatchAction = (type) => {
    const selectedData = [];

    Object.keys(this.props.selectedData).forEach(w => {
      if (this.props.selectedData[w]) {
        selectedData.push(w);
      }
    });

    this.props.clearSelection();
    this.props.dispatch(
      actions.services[`${type}Batch`](selectedData)
    );
  };

  handleSortChange = (sortChange) => {
    this.props.dispatch(
      ui.services.sort(sortChange)
    );
  };

  renderPane() {
    const { params, systemOptions } = this.props;

    if (!this.props.getActiveRow(this.props.services)) return null;

    return (
      <Pane
        width={550}
        onClose={this.props.onPaneClose}
      >
        <ServicesDetail
          service={this.props.getActiveRow(this.props.services)}
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
        <ServicesToolbar
          onFilterClick={this.props.onFilterClick}
          onSearchUpdate={this.props.onSearchChange}
          selected={this.props.selected}
          defaultSearchValue={this.props.location.query.q}
          params={this.props.params}
          batchAction={this.handleBatchAction}
          onAllClick={this.props.onAllClick}
          onNoneClick={this.props.onNoneClick}
          onInvertClick={this.props.onInvertClick}
          onCSVClick={this.handleCSVClick}
        />
        <ServicesTable
          initialFilter={this.props.filterFn}
          onDataFilterChange={this.props.onDataFilterChange}
          activeWorkflowId={parseInt(this.props.params.detailId, 10)}
          setSelectedData={this.props.setSelectedData}
          selectedData={this.props.selectedData}
          onSortChange={this.handleSortChange}
          sortData={this.props.sortData}
          collection={services}
          activeRowId={parseInt(this.props.params.detailId, 10)}
        />
        {this.renderPane()}
      </div>
    );
  }
}
