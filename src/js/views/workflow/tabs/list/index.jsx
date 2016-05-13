import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { flowRight, includes } from 'lodash';

import actions from 'store/api/actions';
import { ORDER_STATES } from 'constants/orders';

import OrdersToolbar from './toolbar';
import OrdersTable from './table';
import Loader from '../../../../components/loader';

const filterOrders = (filter) => (orders) => {
  if (!filter || includes(filter, 'All')) return orders;

  return orders.filter(o => (
    includes(filter, ORDER_STATES.find(s => s.name === o.workflowstatus).title))
  );
};

const orderSelector = state => state.api.orders;
const filterSelector = (state, props) => props.params.filter;

const collectionSelector = createSelector(
  [
    orderSelector,
    filterSelector,
  ], (orders, filter) => flowRight(
    filterOrders(filter)
  )(orders.data)
);

const selector = createSelector(
  [
    orderSelector,
    collectionSelector,
  ], (ordersData, collection) => ({
    sync: ordersData.sync,
    loading: ordersData.loading,
    collection,
  })
);

@connect(selector)
export default class extends Component {
  static propTypes = {
    collection: PropTypes.array,
    dispatch: PropTypes.func,
    id: PropTypes.object,
    loading: PropTypes.bool,
    sync: PropTypes.bool,
    selected: PropTypes.string,
    onFilterClick: PropTypes.func,
    params: PropTypes.object,
    defaultSearchValue: PropTypes.string,
    onSearchChange: PropTypes.func,
    batchAction: PropTypes.func,
    onAllClick: PropTypes.func,
    onNoneClick: PropTypes.func,
    onInvertClick: PropTypes.func,
    onCSVClick: PropTypes.func,
    location: PropTypes.object,
    clearSelection: PropTypes.func,
    selectedData: PropTypes.object,
    filterFn: PropTypes.func,
    onDataFilterChange: PropTypes.func,
    setSelectedData: PropTypes.func,
    sortData: PropTypes.object,
  };

  static contextTypes = {

  };

  componentWillMount() {
    this.props.dispatch(actions.orders.fetch({ workflowid: this.props.id }));

    this.setState({
      filteredData: [],
    });
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
    this.props.dispatch(
      actions.workflows[`${type}Batch`](selectedData)
    );
  };

  handleCSVClick = () => {
    const collection = this.state.filteredData.length ?
      this.state.filteredData : this.props.collection;

    this.props.onCSVClick(collection, 'workflows');
  };

  render() {
    if (!this.props.sync || this.props.loading) {
      return <Loader />;
    }

    return (
      <div className="workflow-detail-tab">
        <OrdersToolbar
          onFilterClick={this.props.onFilterClick}
          onSearchUpdate={this.props.onSearchChange}
          selected={this.props.selected}
          defaultSearchValue={this.props.location.query.q}
          params={this.props.params}
          onAllClick={this.props.onAllClick}
          onNoneClick={this.props.onNoneClick}
          onInvertClick={this.props.onInvertClick}
          batchAction={this.handleBatchAction}
          onCSVClick={this.handleCSVClick}
        />
        <OrdersTable
          initialFilter={this.props.filterFn}
          onDataFilterChange={this.props.onDataFilterChange}
          collection={this.props.collection}
          setSelectedData={this.props.setSelectedData}
          selectedData={this.props.selectedData}
          onSortChange={this.handleSortChange}
          sortData={this.props.sortData}
        />
      </div>
    );
  }
}
