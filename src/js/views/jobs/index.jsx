import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import shallowEqual from 'recompose/shallowEqual';

import { setTitle } from '../../helpers/document';
import patch from '../../hocomponents/patchFuncArgs';
import sort from '../../hocomponents/sort';
import sync from '../../hocomponents/sync';
import withPane from '../../hocomponents/pane';
import { sortDefaults } from '../../constants/sort';
import { formatDate } from '../../helpers/date';
import actions from '../../store/api/actions';
import JobsToolbar from './toolbar';
import JobsTable from './table';
import JobsDetail from './detail';
import { findBy } from '../../helpers/search';

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
  ),
  withPane(JobsDetail, ['location'], 'detail')
)
export default class Jobs extends Component {
  static propTypes = {
    location: PropTypes.object,
    instanceKey: PropTypes.string,
    collection: PropTypes.array,
    info: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
    systemOptions: PropTypes.array,
    onPaneClose: PropTypes.func,
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
    paneId: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    paneTab: PropTypes.string,
    closePane: PropTypes.func,
    openPane: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  componentDidMount() {
    setTitle(`Jobs | ${this.context.getTitle()}`);
  }

  componentDidUpdate() {
    setTitle(`Jobs | ${this.context.getTitle()}`);
  }

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
          location={this.props.location}
          route={this.props.route}
          router={this.context.router}
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
            onDataFilterChange={this.props.onDataFilterChange}
            setSelectedData={this.props.setSelectedData}
            selectedData={this.props.selectedData}
            onSortChange={this.props.onSortChange}
            sortData={this.props.sortData}
            collection={collection}
            onUpdateDone={this.props.updateDone}
            onDetailClick={this.props.openPane}
            paneId={this.props.paneId}
            params={this.props.params}
          />
        </div>
      </div>
    );
  }
}
