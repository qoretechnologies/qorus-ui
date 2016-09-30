import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import shallowEqual from 'recompose/shallowEqual';

import { setTitle } from '../../helpers/document';
import patch from '../../hocomponents/patchFuncArgs';
import sort from '../../hocomponents/sort';
import sync from '../../hocomponents/sync';
import { sortDefaults } from '../../constants/sort';
import { formatDate } from '../../helpers/date';

// data
import actions from '../../store/api/actions';

// components
import Pane from '../../components/pane';

import JobsToolbar from './toolbar';
import JobsTable from './table';
import JobsDetail from './detail';

import { findBy } from '../../helpers/search';
import { flowRight } from 'lodash';

const filterSearch = (search) => (collection) =>
  findBy('name', search, collection);

const jobsSelector = state => state.api.jobs;

const systemOptionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.job)
);

const searchSelector = (state, props) => props.location.query.q;

const collectionSelector = createSelector(
  [
    searchSelector,
    jobsSelector,
  ],
  (search, jobs) => flowRight(
    filterSearch(search)
  )(jobs.data)
);

const viewSelector = createSelector(
  [
    jobsSelector,
    systemOptionsSelector,
    collectionSelector,
  ],
  (jobs, systemOptions, collection, sortData) => ({
    meta: {
      sync: jobs.sync,
      loading: jobs.loading,
    },
    collection,
    systemOptions,
    sortData,
  })
);

const prepareUrlParams = mapProps(props => {
  const { date: urlDate } = props.params;
  const urlParams = {};
  if (urlDate) {
    urlParams.date = formatDate(urlDate).format();
  }
  return { ...props, urlParams };
});

const fetchOnUrlParamsChange = lifecycle({
  componentWillReceiveProps(newProps) {
    const { params: newParams, fetch } = newProps;
    const { params } = this.props;
    if (!shallowEqual(params.date, newParams.date)) {
      fetch();
    }
  },
});

@compose(
  connect(
    viewSelector,
    actions.jobs
  ),
  onlyUpdateForKeys(['meta', 'collection', 'systemOptions', 'sortData', 'params']),
  prepareUrlParams,
  patch('fetch', ['urlParams']),
  sync('meta', true, 'fetch'),
  fetchOnUrlParamsChange,
  sort(
    'jobs',
    'collection',
    sortDefaults.jobs
  )
)
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
    onSortChange: PropTypes.func,
    onCSVClick: PropTypes.func,
    generateCSV: PropTypes.func,
    updateDone: PropTypes.func,
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
    this.props[`${type}Batch`](selectedData);
  };

  handleCSVClick = () => {
    this.props.onCSVClick(this.props.collection, 'jobs');
  };

  renderPane() {
    const { params } = this.props;
    const model = this.props.getActiveRow(this.props.collection);

    if (!model) return null;

    return (
      <Pane
        width={550}
        onClose={this.props.onPaneClose}
      >
        <JobsDetail
          model={this.props.getActiveRow(this.props.collection)}
          tabId={params.tabId}
          location={this.props.location}
        />
      </Pane>
    );
  }


  render() {
    const { collection } = this.props;

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
            location={this.props.location}
            params={this.props.params}
            onDataFilterChange={this.props.onDataFilterChange}
            activeWorkflowId={parseInt(this.props.params.detailId, 10)}
            setSelectedData={this.props.setSelectedData}
            selectedData={this.props.selectedData}
            onSortChange={this.props.onSortChange}
            sortData={this.props.sortData}
            collection={collection}
            onUpdateDone={this.props.updateDone}
            activeRowId={parseInt(this.props.params.detailId, 10)}
          />
        </div>
        {this.renderPane()}
      </div>
    );
  }
}
