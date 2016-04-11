import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flow } from 'lodash';
import { compare } from 'utils';
import goTo from 'routes';

// data
import actions from 'store/api/actions';

// components
import Loader from 'components/loader';
import Pane from 'components/pane';

// partials
import WorkflowsToolbar from './toolbar';
import WorkflowsTable from './table';
import WorkflowsDetail from './detail';

const sortWorkflows = (workflows) =>
  workflows.slice().sort(compare('exec_count', ['name'], 'des'));


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


const infoSelector = state => state.api.system;

const defaultWorkflowFilter = (workflows) =>
  workflows.map(w => Object.assign({ filter: false }, w));


const collectionSelector = createSelector(
  [
    workflowsSelector,
  ],
  (workflows) => flow(
    sortWorkflows,
    defaultWorkflowFilter
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
    this.props.dispatch(actions.workflows.fetch());

    this.setState({
      filterFn: null,
      selected: 'none',
    });
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
      'workflows',
      this.props.route.path,
      this.props.params,
      { detailId: null, tabId: null }
    );
  }

  /**
   * Handles the click on the dropdowns checkbox
   *
   * @param {Function} filterFn
   */
  onFilterClick(filterFn) {
    this.setState({
      filterFn,
    });
  }

  /**
   * Changes the state of what workflows are selected
   * Used by the dropdown checkbox in Toolbar
   *
   * @param {String} selected
   */
  onWorkflowFilterChange(selected) {
    this.setState({
      selected,
    });
  }

  setTitle() {
    document.title = `Workflows | ${this.context.getTitle()}`;
  }

  getActiveWorkflow() {
    if (!this.props.params.detailId) return null;

    return this.props.workflows.find(::this.isActive);
  }

  isActive(workflow) {
    return workflow.id === parseInt(this.props.params.detailId, 10);
  }

  renderPane() {
    const { params, errors, systemOptions, globalErrors } = this.props;

    if (!this.getActiveWorkflow()) return null;

    return (
      <Pane
        width={550}
        onClose={::this.onClosePane}
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
          onFilterClick={::this.onFilterClick}
          selected={this.state.selected}
        />
        <WorkflowsTable
          initialFilter={this.state.filterFn}
          onWorkflowFilterChange={::this.onWorkflowFilterChange}
          workflows={this.props.workflows}
          activeWorkflowId={parseInt(this.props.params.detailId, 10)}
        />
        {this.renderPane()}
      </div>
    );
  }
}
