import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { get, compose, curry } from 'lodash';
import { compare } from 'utils';
import goTo from 'routes';

// data
import actions from 'store/api/actions';

// components
import Loader from 'components/loader';
import { PaneView } from 'components/pane';

// partials
import WorkflowsToolbar from './toolbar';
import WorkflowsTable from './table';
import WorkflowsDetail from './detail';


const filterSearch = curry((search, workflows) =>
  workflows.filter(w =>
    search === undefined || w.name.toLowerCase().indexOf(search) > -1 ||
    w.id.toString().indexOf(search) > -1)
);

const filterDeprecated = curry((hide, workflows) =>
  workflows.filter(w =>
    !hide || get(w, 'deprecated') === hide
  )
);

const sortWorkflows = (workflows) =>
  workflows.slice().sort(compare('exec_count', ['name'], 'des'));

const workflowsSelector = state => state.api.workflows;
const optionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.workflow)
);
const searchSelector = (state, props) => props.location.query.q;
const infoSelector = () => { return {}; };
const deprecatedSelector = (state, props) => props.params.filter === 'hide';

const collectionSelector = createSelector(
  [
    searchSelector,
    workflowsSelector,
    deprecatedSelector
  ],
  (search, workflows, deprecated) => compose(
    sortWorkflows,
    filterDeprecated(deprecated),
    filterSearch(search)
  )(workflows.data)
);

const viewSelector = createSelector(
  [
    workflowsSelector,
    infoSelector,
    collectionSelector,
    optionsSelector
  ],
  (workflows, info, collection, options) => {
    return {
      sync: workflows.sync,
      loading: workflows.loading,
      workflows: collection,
      info: {},
      options
    };
  }
);

@connect(viewSelector)
class Workflows extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    workflows: PropTypes.array,
    info: PropTypes.object,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    options: PropTypes.array,
    params: PropTypes.object,
    route: PropTypes.object
  }

  static childContextTypes = {
    params: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func
  }

  constructor(...props) {
    super(...props);
    const { dispatch } = this.props;
    dispatch(actions.workflows.fetch());
  }

  getChildContext() {
    return {
      params: this.props.params,
      route: this.props.route,
      dispatch: this.props.dispatch
    };
  }

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate() {
    this.setTitle();
  }

  setTitle() {
    const { info } = this.props;

    const inst = info['instance-key'] ? info['instance-key'] : 'Qorus';

    document.title = `Workflows | ${inst}`;
  }

  renderPane() {
    const { params, route, workflows, options } = this.props;

    if (!params.detailId) return null;

    const workflow = workflows.find(w => {
      return w.id === parseInt(params.detailId, 10);
    });

    if (!workflow) throw new Error('Requested workflow not found.');

    return (
      <PaneView width={ 500 } onClose={ () => {
        goTo(
          'workflows',
          route.path,
          params,
          { detailId: null, tabId: null }
        );
      }}>
        <div className='relative'>
          <WorkflowsDetail
              workflow={workflow}
              options={options}
              tabId={params.tabId} />
        </div>
      </PaneView>
    );
  }

  render() {
    const { sync, loading, workflows } = this.props;

    if (!sync || loading) {
      return <Loader />;
    }

    return (
      <div>
        <WorkflowsToolbar />
        <WorkflowsTable workflows={ workflows } />
        { this.renderPane() }
      </div>
    );
  }
}

export default Workflows;
