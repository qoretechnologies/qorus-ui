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

import JobsToolbar from './toolbar';
import JobsTable from './table';
import JobsDetail from './detail';

import { findBy } from '../../helpers/search';
import { flowRight } from 'lodash';
import firstBy from 'thenby';

const sortCollection = (sortData) => (collection) => collection.slice().sort(
  firstBy(w => w[sortData.sortBy] || 0, sortData.sortByKey)
    .thenBy(w => w[sortData.historySortBy] || 0, sortData.historySortByKey)
);

const filterSearch = (search) => (collection) =>
  findBy('name', search, collection);

const jobsSelector = state => state.api.jobs;

const systemOptionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.job)
);

const sortSelector = state => state.ui.jobs;
const searchSelector = (state, props) => props.location.query.q;

const collectionSelector = createSelector(
  [
    sortSelector,
    searchSelector,
    jobsSelector,
  ],
  (sortData, search, jobs) => flowRight(
    sortCollection(sortData),
    filterSearch(search)
  )(jobs.data)
);

const viewSelector = createSelector(
  [
    jobsSelector,
    systemOptionsSelector,
    collectionSelector,
    sortSelector,
  ],
  (jobs, systemOptions, collection, sortData) => ({
    sync: jobs.sync,
    loading: jobs.loading,
    collection,
    systemOptions,
    sortData,
  })
);

@connect(viewSelector)
export default class Jobs extends Component {
  static propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    collection: PropTypes.array,
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
    sortData: PropTypes.object,
    onCSVClick: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    params: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func,
    location: PropTypes.object,
  };

  getChildContext() {
    return {
      params: this.props.params,
      route: this.props.route,
      dispatch: this.props.dispatch,
      location: this.props.location,
    };
  }

  componentWillMount() {
    this.props.dispatch(actions.jobs.fetch());
  }

  componentDidMount() {
    setTitle(`Jobs | ${this.context.getTitle()}`);
  }

  componentDidUpdate() {
    setTitle(`Jobs | ${this.context.getTitle()}`);
  }

  getCSVTable = () => this.props.generateCSV(this.props.collection, 'jobs');

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
      actions.jobs[`${type}Batch`](selectedData)
    );
  };

  handleSortChange = (sortChange) => {
    this.props.dispatch(
      ui.jobs.sort(sortChange)
    );
  };

  handleCSVClick = () => {
    this.props.onCSVClick(this.props.collection, 'jobs');
  };

  renderPane() {
    const { params, systemOptions } = this.props;

    if (!this.props.getActiveRow(this.props.collection)) return null;

    return (
      <Pane
        width={550}
        onClose={this.props.onPaneClose}
      >
        <JobsDetail
          model={this.props.getActiveRow(this.props.collection)}
          systemOptions={systemOptions}
          tabId={params.tabId}
        />
      </Pane>
    );
  }


  render() {
    const { sync, loading, collection } = this.props;

    if (!sync || loading) {
      return <Loader />;
    }

    return (
      <div>
        <JobsToolbar
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
        <div className="table--flex">
          <JobsTable
            initialFilter={this.props.filterFn}
            onDataFilterChange={this.props.onDataFilterChange}
            activeWorkflowId={parseInt(this.props.params.detailId, 10)}
            setSelectedData={this.props.setSelectedData}
            selectedData={this.props.selectedData}
            onSortChange={this.handleSortChange}
            sortData={this.props.sortData}
            collection={collection}
            activeRowId={parseInt(this.props.params.detailId, 10)}
          />
        </div>
        {this.renderPane()}
      </div>
    );
  }
}
