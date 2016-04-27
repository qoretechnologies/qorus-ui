import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight, includes } from 'lodash';
import { compare } from 'utils';
import { goTo } from '../../helpers/router';

// data
import actions from 'store/api/actions';

// components
import Loader from 'components/loader';
import Pane from 'components/pane';

// partials
import WorkflowsToolbar from './toolbar';
import WorkflowsTable from './table';
import WorkflowsDetail from './detail';

import { WORKFLOW_FILTERS } from '../../constants/filters';
import { filterArray, handleFilterChange, getFetchParams } from '../../helpers/workflows';
import { findBy } from '../../helpers/search';

const sortWorkflows = (workflows) =>
  workflows.slice().sort(compare('exec_count', ['name'], 'des'));

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
    sortWorkflows,
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

@connect(viewSelector)
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
    params: PropTypes.object,
    route: PropTypes.object,
    location: PropTypes.object,
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

    this.setState({
      filterFn: null,
      selected: 'none',
      filteredWorkflows: [],
      selectedWorkflows: {},
    });
  }

  componentDidMount() {
    this.setTitle();
  }

  componentWillReceiveProps(next) {
    if (this.props.params.filter !== next.params.filter ||
        this.props.params.date !== next.params.date) {
      const fetchParams = getFetchParams(next.params.filter, next.params.date);

      this.clearSelection();
      this.props.dispatch(actions.workflows.fetch(fetchParams));
    }
  }

  componentDidUpdate() {
    this.setTitle();
  }

  setTitle() {
    document.title = `Workflows | ${this.context.getTitle()}`;
  }

  getActiveWorkflow() {
    if (!this.props.params.detailId) return null;

    return this.props.workflows.find(this.isActive);
  }

  setSelectedWorkflows = (selectedWorkflows) => {
    this.setState({
      selectedWorkflows,
    });
  };

  isActive = (workflow) => workflow.id === parseInt(this.props.params.detailId, 10);

  handlePaneClose = () => {
    goTo(
      this.context.router,
      'workflows',
      this.props.route.path,
      this.props.params,
      { filter: this.props.params.filter, detailId: null, tabId: null },
      this.props.location.query
    );
  };

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
   * Handles the click on the dropdowns checkbox
   *
   * @param {Function} filterFn
   */
  handleFilterClick = (filterFn) => {
    this.setState({
      filterFn,
    });
  };

  /**
   * Changes the state of what workflows are selected
   * Used by the dropdown checkbox in Toolbar
   *
   * @param {String} selected
   */
  handleWorkflowFilterChange = (selected) => {
    this.setState({
      selected,
    });
  };

  /**
   * Applies the current filter to the URL
   *
   * @param {String} q
   */
  handleSearchChange = (q) => {
    goTo(
      this.context.router,
      'workflows',
      this.props.route.path,
      this.props.params,
      {},
      { q },
    );
  };

  /**
   * Handles the batch action calls like
   * enabling, disabling, reseting etc
   * of multiple workflows
   *
   * @param {String} type
   */
  handleBatchAction = (type) => {
    const selectedWorkflows = [];

    Object.keys(this.state.selectedWorkflows).forEach(w => {
      if (this.state.selectedWorkflows[w]) {
        selectedWorkflows.push(w);
      }
    });

    this.clearSelection();
    this.props.dispatch(
      actions.workflows[`${type}Batch`](selectedWorkflows)
    );
  };

  clearSelection = () => {
    this.setSelectedWorkflows({});
    this.handleWorkflowFilterChange('none');
  };

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

  renderPane() {
    const { params, errors, systemOptions, globalErrors } = this.props;

    if (!this.getActiveWorkflow()) return null;

    return (
      <Pane
        width={550}
        onClose={this.handlePaneClose}
      >
        <WorkflowsDetail
          workflow={this.getActiveWorkflow()}
          systemOptions={systemOptions}
          errors={errors[this.getActiveWorkflow().id] || []}
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
          onFilterClick={this.handleFilterClick}
          onRunningClick={this.handleRunningClick}
          onDeprecatedClick={this.handleDeprecatedClick}
          onLastVersionClick={this.handleLastVersionClick}
          onSearchUpdate={this.handleSearchChange}
          selected={this.state.selected}
          defaultSearchValue={this.props.location.query.q}
          params={this.props.params}
          batchAction={this.handleBatchAction}
        />
        <WorkflowsTable
          initialFilter={this.state.filterFn}
          onWorkflowFilterChange={this.handleWorkflowFilterChange}
          workflows={this.props.workflows}
          activeWorkflowId={parseInt(this.props.params.detailId, 10)}
          setSelectedWorkflows={this.setSelectedWorkflows}
          selectedWorkflows={this.state.selectedWorkflows}
        />
        {this.renderPane()}
      </div>
    );
  }
}
