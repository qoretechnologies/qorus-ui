import React, { Component, PropTypes } from 'react';

// utils
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flowRight } from 'lodash';
import { setTitle } from '../../helpers/document';
import { sortTable } from '../../helpers/table';

// data
import actions from 'store/api/actions';
import * as ui from 'store/ui/actions';

// components
import Loader from 'components/loader';

// partials
import GroupsToolbar from './toolbar';
import GroupsTable from './table';
import GroupsDetail from './detail';

import { findBy } from '../../helpers/search';

const sortGroups = (sortData) => (groups) => sortTable(groups, sortData);

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

const sortSelector = (state) => state.ui.groups;

const collectionSelector = createSelector(
  [
    searchSelector,
    groupsSelector,
    sortSelector,
  ],
  (search, groups, sortData) => flowRight(
    sortGroups(sortData),
    filterSearch(search),
  )(groups.data)
);

const viewSelector = createSelector(
  [
    groupsSelector,
    collectionSelector,
    sortSelector,
  ],
  (groups, collection, sortData) => ({
    sync: groups.sync,
    loading: groups.loading,
    collection,
    sortData,
  })
);

@connect(viewSelector)
export default class Workflows extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    instanceKey: PropTypes.string,
    collection: PropTypes.array,
    sync: PropTypes.bool,
    loading: PropTypes.bool,
    sortData: PropTypes.object,
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
    this.props.dispatch(actions.groups.fetch());

    this.setState({
      sortBy: 'enabled',
      sortByKey: 1,
      historySortBy: 'name',
      historySortByKey: -1,
    });
  }

  componentDidMount() {
    setTitle(`Groups | ${this.context.getTitle()}`);
  }

  componentDidUpdate() {
    setTitle(`Groups | ${this.context.getTitle()}`);
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

  handleSortChange = (sortChange) => {
    this.props.dispatch(
      ui.groups.sort(sortChange)
    );
  };

  handleCSVClick = () => {
    this.props.onCSVClick(this.props.collection, 'groups');
  };

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
            onSortChange={this.handleSortChange}
            sortData={this.props.sortData}
            collection={this.props.collection}
          />
        </div>
      </div>
    );
  }
}
