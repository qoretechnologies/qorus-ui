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

import JobsTable from './table';
import Detail from './detail';

const collectionSelector = state => state.api.jobs;

const systemOptionsSelector = state => (
  state.api.systemOptions.data.filter(opt => opt.job)
);

const viewSelector = createSelector(
  [
    collectionSelector,
    systemOptionsSelector,
  ],
  (collection, systemOptions) => ({
    sync: collection.sync,
    loading: collection.loading,
    collection: collection.data,
    systemOptions,
  })
);

const JobsToolbar = () => <p>Jobs toolbar</p>;


@connect(viewSelector)
export default class Jobs extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    collection: PropTypes.array,
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
    this.props.dispatch(actions.jobs.fetch());
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
      'jobs',
      this.props.route.path,
      this.props.params,
      { detailId: null, tabId: null }
    );
  }


  setTitle() {
    document.title = `Jobs | ${this.context.getTitle()}`;
  }


  getActiveRow() {
    if (!this.props.params.detailId) return null;

    return this.props.collection.find(::this.isActive);
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
        <Detail
          model={this.getActiveRow()}
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
        <JobsToolbar />
        <div className="table--flex">
          <JobsTable
            collection={collection}
            activeRowId={parseInt(this.props.params.detailId, 10)}
          />
        </div>
        {this.renderPane()}
      </div>
    );
  }
}
