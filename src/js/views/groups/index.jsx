import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import { setTitle } from '../../helpers/document';
import compose from 'recompose/compose';

// data
import actions from 'store/api/actions';
import sort from '../../hocomponents/sort';

// components
import Loader from 'components/loader';
import { Control as Button } from 'components/controls';

// partials
import GroupsToolbar from './toolbar';
import GroupsTable from './table';
import GroupsDetail from './detail';

import { findBy } from '../../helpers/search';

const filterSearch = (search) => (groups) =>
  findBy(['name', 'description'], search, groups);

const groupsSelector = state => {
  const groups = state.api.groups;

  groups.data.map(d => {
    const newData = d;

    newData.workflows_count = newData.workflows.length;
    newData.jobs_count = newData.jobs.length;
    newData.services_count = newData.services.length;
    newData.vmaps_count = newData.vmaps.length;
    newData.roles_count = newData.roles.length;
    newData.mappers_count = newData.mappers.length;

    return newData;
  });

  return groups;
};

const searchSelector = (state, props) => props.location.query.q;

const collectionSelector = createSelector(
  [
    searchSelector,
    groupsSelector,
  ],
  (search, groups) => flowRight(
    filterSearch(search),
  )(groups.data)
);

const viewSelector = createSelector(
  [
    groupsSelector,
    collectionSelector,
  ],
  (groups, collection) => ({
    sync: groups.sync,
    loading: groups.loading,
    collection,
  })
);

@compose(
  connect(viewSelector),
  sort(
    'groups',
    'collection',
    {
      sortBy: 'enabled',
      sortByKey: { ignoreCase: true, direction: 1 },
      historySortBy: 'name',
      historySortByKey: { ignoreCase: true, direction: 1 },
    }
  )
)
export default class Workflows extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    collection: PropTypes.array,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
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
    onAllClick: PropTypes.func,
    onNoneClick: PropTypes.func,
    onInvertClick: PropTypes.func,
    onCSVClick: PropTypes.func,
    offset: PropTypes.number,
    limit: PropTypes.number,
  };

  static defaultProps = {
    limit: 100,
    offset: 0,
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
    const offset = this.props.offset;
    const limit = this.props.limit;

    this.setState({
      limit,
      offset,
      fetchMore: false,
      sortBy: 'enabled',
      sortByKey: 1,
      historySortBy: 'name',
      historySortByKey: -1,
    });

    this.fetchData(this.props, { limit, offset, fetchMore: false });
  }

  componentDidMount() {
    setTitle(`Groups | ${this.context.getTitle()}`);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.offset !== nextState.offset) {
      this.fetchData(nextProps, nextState);
    }
  }

  componentDidUpdate() {
    setTitle(`Groups | ${this.context.getTitle()}`);
  }

  /**
   * Fetches the orders based on workflowid and
   * the date provided
   */
  fetchData(props, state) {
    props.dispatch(
      actions.groups.fetch({
        offset: state.offset,
        limit: state.limit,
        fetchMore: state.fetchMore,
      })
    );
  }

  /**
   * Handles the batch action calls like
   * enabling, disabling, reseting etc
   * of multiple workflows
   *
   * @param {String} type
   */
  handleBatchAction = (type) => {
    let selectedData = [];

    Object.keys(this.props.selectedData).forEach(w => {
      if (this.props.selectedData[w]) {
        selectedData.push(w);
      }
    });

    selectedData = selectedData.map(s => (
      this.props.collection.find(c => c.id === parseInt(s, 10)).name
    ));

    this.props.clearSelection();
    this.props.dispatch(
      actions.groups[`${type}Batch`](selectedData)
    );
  };

  handleCSVClick = () => {
    this.props.onCSVClick(this.props.collection, 'groups');
  };

  handleLoadMoreClick = () => {
    const offset = this.state.offset + this.props.limit;
    const limit = this.state.limit;

    this.setState({
      offset,
      limit,
      fetchMore: true,
    });
  };

  renderLoadMore() {
    if (this.props.collection.length < (this.state.limit + this.state.offset)) return undefined;

    return (
      <Button
        big
        btnStyle="success"
        label="Load more..."
        action={this.handleLoadMoreClick}
      />
    );
  }

  render() {
    if (!this.props.sync || this.props.loading) {
      return <Loader />;
    }

    if (this.props.params.id) {
      const group = this.props.collection.find(c => c.name === this.props.params.id);
      return (
        <GroupsDetail group={group} />
      );
    }

    return (
      <div>
        <GroupsToolbar
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
          <GroupsTable
            initialFilter={this.props.filterFn}
            onDataFilterChange={this.props.onDataFilterChange}
            setSelectedData={this.props.setSelectedData}
            selectedData={this.props.selectedData}
            onSortChange={this.props.handleSortChange}
            sortData={this.props.sortData}
            collection={this.props.collection}
          />
          { this.renderLoadMore() }
        </div>
      </div>
    );
  }
}
