import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight, includes } from 'lodash';
import compose from 'recompose/compose';

import { goTo } from '../../helpers/router';
import { setTitle } from '../../helpers/document';
import sort from '../../hocomponents/sort';
// data
import actions from '../../store/api/actions';

// components
import Loader from '../../components/loader';
import Pane from '../../components/pane';

// partials
import WorkflowsToolbar from './toolbar';
import WorkflowsTable from './table';
import WorkflowsDetail from './detail';

import { WORKFLOW_FILTERS } from '../../constants/filters';
import { DATE_FORMATS } from '../../constants/dates';
import {
  filterArray,
  handleFilterChange,
  getFetchParams,
  formatDate,
} from '../../helpers/workflows';
import { findBy } from '../../helpers/search';

const filterSearch = (search) => (workflows) =>
  findBy(['name', 'id'], search, workflows);

const filterRunning = (filter) => (workflows) =>
  workflows.filter(w => !(includes(filter, WORKFLOW_FILTERS.RUNNING) && w.exec_count <= 0));

const filterLastVersion = (filter) => (workflows) => {
  if (!includes(filter, WORKFLOW_FILTERS.LAST_VERSION)) return workflows;

  return workflows.filter(w => {
    for (const workflow of workflows) {
      if (w.name === workflow.name && parseFloat(w.version) < parseFloat(workflow.version)) {
        return false;
      }
    }

    return true;
  });
};

const filterDeprecated = (filter) => (workflows) => {
  if (includes(filter, WORKFLOW_FILTERS.DEPRECATED)) return workflows;

  return workflows.filter(w => !w.deprecated);
};

const errorsComparator = (a, b) => {
  if (a.error < b.error) return -1;
  if (a.error > b.error) return +1;
  return 0;
};

const errorsToArray = (state, ref) => (
  (state.api.errors[ref] && state.api.errors[ref].data &&
   Object.keys(state.api.errors[ref].data).
   map(error => state.api.errors[ref].data[error]).
   sort(errorsComparator)) || []
);

const workflowsSelector = state => state.api.workflows;

const errorsSelector = state => (
  Object.keys(state.api.errors).
    filter(ref => ref.indexOf('workflow/') === 0).
    reduce((errs, ref) => (
      Object.assign(errs, {
        [ref.substring(9)]: errorsToArray(state, ref),
      })
    ), {})
);

const systemOptionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.workflow)
);

const globalErrorsSelector = state => errorsToArray(state, 'global');

const searchSelector = (state, props) => props.location.query.q;

const filterSelector = (state, props) => filterArray(props.params.filter);

const infoSelector = state => state.api.system;

const collectionSelector = createSelector(
  [
    searchSelector,
    filterSelector,
    workflowsSelector,
  ],
  (search, filter, workflows) => flowRight(
    filterLastVersion(filter),
    filterRunning(filter),
    filterSearch(search),
    filterDeprecated(filter),
  )(workflows.data)
);

const viewSelector = createSelector(
  [
    workflowsSelector,
    errorsSelector,
    infoSelector,
    collectionSelector,
    systemOptionsSelector,
    globalErrorsSelector,
  ],
  (workflows, errors, info, collection, systemOptions, globalErrors) => ({
    sync: workflows.sync,
    loading: workflows.loading,
    workflows: collection,
    errors,
    info,
    systemOptions,
    globalErrors,
  })
);

@compose(
  connect(viewSelector),
  sort('workflows', 'workflows')
)
export default class Workflows extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    workflows: PropTypes.array,
    errors: PropTypes.object,
    info: PropTypes.object,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    systemOptions: PropTypes.array,
    globalErrors: PropTypes.array,
    sortData: PropTypes.object,
    handleSortChange: PropTypes.func,
    params: PropTypes.object,
    route: PropTypes.object,
    location: PropTypes.object,
    onFilterClick: PropTypes.func,
    filterFn: PropTypes.func,
    onSearchChange: PropTypes.func,
    clearSelection: PropTypes.func,
    onDataFilterChange: PropTypes.func,
    setSelectedData: PropTypes.func,
    onBatchAction: PropTypes.func,
    selectedData: PropTypes.object,
    selected: PropTypes.string,
    onPaneClose: PropTypes.func,
    getActiveRow: PropTypes.func,
    onAllClick: PropTypes.func,
    onNoneClick: PropTypes.func,
    onInvertClick: PropTypes.func,
    onCSVClick: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    getTitle: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func,
  };

  state = {
    filteredWorkflows: [],
    sortBy: 'name',
    sortByKey: 1,
    historySortBy: 'version',
    historySortByKey: -1,
  };

  getChildContext() {
    return {
      location: this.props.location,
      params: this.props.params,
      route: this.props.route,
      dispatch: this.props.dispatch,
    };
  }

  componentWillMount() {
    const fetchParams = getFetchParams(this.props.params.filter, this.props.params.date);

    this.props.dispatch(actions.workflows.fetch(fetchParams));
  }

  componentDidMount() {
    setTitle(`Workflows | ${this.context.getTitle()}`);
  }

  componentWillReceiveProps(next) {
    if (this.props.params.filter !== next.params.filter ||
        this.props.params.date !== next.params.date) {
      const fetchParams = getFetchParams(next.params.filter, next.params.date);

      this.props.clearSelection();
      this.props.dispatch(actions.workflows.fetch(fetchParams));
    }
  }

  componentDidUpdate() {
    setTitle(`Workflows | ${this.context.getTitle()}`);
  }

  /**
   * Gets the formatted date for the
   * workflow link in the workflow table
   */
  getDate = () => formatDate(this.props.params.date).format(DATE_FORMATS.URL_FORMAT);

  /**
   * Applies the current filter to the URL
   *
   * @param {Array} filter
   */
  applyFilter(filter) {
    goTo(
      this.context.router,
      'workflows',
      this.props.route.path,
      this.props.params,
      { filter: filter.join(','), detailId: null, tabId: null },
      this.props.location.query
    );
  }

  /**
   * Handles filtering for only running workflows
   */
  handleRunningClick = () => {
    const urlFilter = handleFilterChange(
      this.props.params.filter,
      WORKFLOW_FILTERS.RUNNING
    );

    this.applyFilter(urlFilter);
  };

  /**
   * Handles displaying hidden workflows
   */
  handleDeprecatedClick = () => {
    const urlFilter = handleFilterChange(
      this.props.params.filter,
      WORKFLOW_FILTERS.DEPRECATED
    );

    this.applyFilter(urlFilter);
  };

  /**
   * Handles displaying hidden workflows
   */
  handleLastVersionClick = () => {
    const urlFilter = handleFilterChange(
      this.props.params.filter,
      WORKFLOW_FILTERS.LAST_VERSION
    );

    this.applyFilter(urlFilter);
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
      actions.workflows[`${type}Batch`](selectedData)
    );
  };

  handleCSVClick = () => {
    const collection = this.state.filteredWorkflows.length ?
      this.state.filteredWorkflows : this.props.workflows;

    this.props.onCSVClick(collection, 'workflows');
  };

  renderPane() {
    const { params, errors, systemOptions, globalErrors } = this.props;

    if (!this.props.getActiveRow(this.props.workflows)) return null;

    return (
      <Pane
        width={550}
        onClose={this.props.onPaneClose}
      >
        <WorkflowsDetail
          workflow={this.props.getActiveRow(this.props.workflows)}
          systemOptions={systemOptions}
          errors={errors[this.props.getActiveRow(this.props.workflows).id] || []}
          globalErrors={globalErrors}
          tabId={params.tabId}
        />
      </Pane>
    );
  }

  render() {
    if (!this.props.sync || this.props.loading) {
      return <Loader />;
    }

    return (
      <div>
        <WorkflowsToolbar
          onFilterClick={this.props.onFilterClick}
          onRunningClick={this.handleRunningClick}
          onDeprecatedClick={this.handleDeprecatedClick}
          onLastVersionClick={this.handleLastVersionClick}
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
        <WorkflowsTable
          initialFilter={this.props.filterFn}
          onWorkflowFilterChange={this.props.onDataFilterChange}
          workflows={this.props.workflows}
          activeWorkflowId={parseInt(this.props.params.detailId, 10)}
          setSelectedWorkflows={this.props.setSelectedData}
          selectedWorkflows={this.props.selectedData}
          onSortChange={this.props.handleSortChange}
          sortData={this.props.sortData}
          linkDate={this.getDate()}
        />
        {this.renderPane()}
      </div>
    );
  }
}
