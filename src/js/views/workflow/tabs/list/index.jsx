import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { flowRight, includes, union } from 'lodash';

import actions from 'store/api/actions';
import { ORDER_STATES, CUSTOM_ORDER_STATES, ORDER_ACTIONS } from 'constants/orders';
import { DATE_FORMATS } from 'constants/dates';

import OrdersToolbar from './toolbar';
import OrdersTable from './table';
import Loader from '../../../../components/loader';
import Modal from '../../../../components/modal';

import { findBy } from '../../../../helpers/search';
import { formatDate } from '../../../../helpers/workflows';

const filterOrders = (filter) => (orders) => {
  if (!filter || includes(filter, 'All')) return orders;

  const states = union(ORDER_STATES, CUSTOM_ORDER_STATES);

  return orders.filter(o => (
    includes(filter, states.find(s => s.name === o.workflowstatus).title))
  );
};

const filterSearch = (search) => (orders) => findBy(['id', 'workflowstatus'], search, orders);

const orderSelector = state => state.api.orders;
const filterSelector = (state, props) => props.params.filter;
const searchSelector = (state, props) => props.location.query.q;

const collectionSelector = createSelector(
  [
    orderSelector,
    filterSelector,
    searchSelector,
  ], (orders, filter, search) => flowRight(
    filterSearch(search),
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
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.setState({
      filteredData: [],
    });

    this.fetchData(this.props);
  }

  componentWillReceiveProps(next) {
    if (this.props.params.date !== next.params.date) {
      this.fetchData(next);
    }
  }

  /**
   * Fetches the orders based on workflowid and
   * the date provided
   */
  fetchData(props) {
    const date = formatDate(props.params.date).format(DATE_FORMATS.URL_FORMAT);

    props.dispatch(actions.orders.fetch({ workflowid: props.id, date, sort: 'started' }));
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

    const canBatch = selectedData.some(o => (
        !includes(
          ORDER_ACTIONS[this.props.collection.find(order => (
            order.id === parseInt(o, 10))
          ).workflowstatus],
          type
        )
      )
    );

    if (canBatch) {
      this.props.clearSelection();
      this.props.dispatch(
        actions.orders[`${type}Batch`](selectedData)
      );
    } else {
      this._modal = (
        <Modal>
          <Modal.Header
            onClose={this.handleModalCloseClick}
          >
            Error
          </Modal.Header>
          <Modal.Body>
            <p className="text-danger">
              There was an error running the { type } batch call.
            </p>
          </Modal.Body>
        </Modal>
      );

      this.context.openModal(this._modal);
    }
  };

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  handleCSVClick = () => {
    const collection = this.state.filteredData.length ?
      this.state.filteredData : this.props.collection;

    this.props.onCSVClick(collection, 'orders');
  };

  renderTable() {
    if (!this.props.collection.length) return <h5> No data found </h5>;

    return (
      <OrdersTable
        initialFilter={this.props.filterFn}
        onDataFilterChange={this.props.onDataFilterChange}
        collection={this.props.collection}
        setSelectedData={this.props.setSelectedData}
        selectedData={this.props.selectedData}
        onSortChange={this.handleSortChange}
        sortData={this.props.sortData}
      />
    );
  }

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
        { this.renderTable() }
      </div>
    );
  }
}
