import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';

import { flowRight, includes, union } from 'lodash';
import { normalizeName } from '../../../../store/api/resources/utils';

import actions from 'store/api/actions';
import { ORDER_STATES, CUSTOM_ORDER_STATES, ORDER_ACTIONS } from '../../../../constants/orders';
import { DATE_FORMATS } from '../../../../constants/dates';
import sort from '../../../../hocomponents/sort';

import OrdersToolbar from './toolbar';
import OrdersTable from './table';
import Loader from '../../../../components/loader';
import Reschedule from './modals/reschedule';
import Error from './modals/error';
import { Control as Button } from 'components/controls';

import { findBy } from '../../../../helpers/search';
import { formatDate } from '../../../../helpers/workflows';
import { sortDefaults } from '../../../../constants/sort';

const filterOrders = (filter) => (orders) => {
  if (!filter || includes(filter, 'All')) return orders;

  const states = union(ORDER_STATES, CUSTOM_ORDER_STATES);

  return orders.filter(o => (
    includes(filter, states.find(s => s.name === o.workflowstatus).title))
  );
};

const filterSearch = (search) => (orders) => findBy(['id', 'workflowstatus'], search, orders);
const normalize = (orders) => orders.map(o => {
  if (o.normalizedName) return o;

  return normalizeName(o);
});

const getWfOrders = (id) => (collection) => (
  collection.filter(order => order.workflowid === parseInt(id, 10))
);

const orderSelector = state => state.api.orders;
const filterSelector = (state, props) => props.params.filter;
const idSelector = (state, props) => props.params.id;
const searchSelector = (state, props) => props.location.query.q;
const sortSelector = state => state.ui.orders;
const userSelector = state => state.api.currentUser.data.username;

const collectionSelector = createSelector(
  [
    orderSelector,
    filterSelector,
    searchSelector,
    idSelector,
  ], (orders, filter, search, id) => flowRight(
    filterSearch(search),
    filterOrders(filter),
    normalize,
    getWfOrders(id)
  )(orders.data)
);

const selector = createSelector(
  [
    orderSelector,
    collectionSelector,
    sortSelector,
    userSelector,
  ], (ordersData, collection, sortData, username) => ({
    sync: ordersData.sync,
    loading: ordersData.loading,
    collection,
    sortData,
    username,
  })
);

@compose(
  connect(selector),
  sort(
    'workflow-detail',
    'collection',
    sortDefaults.orders
  )
)
export default class extends Component {
  static propTypes = {
    collection: PropTypes.array,
    dispatch: PropTypes.func,
    id: PropTypes.string,
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
    onSortChange: PropTypes.func,
    username: PropTypes.string,
    offset: PropTypes.number,
    limit: PropTypes.number,
    linkDate: PropTypes.string,
    sort: PropTypes.string,
    sortDir: PropTypes.boolean,
  };

  static defaultProps = {
    offset: 0,
    limit: 100,
    sort: 'started',
    sortDir: true,
  };

  static contextTypes = {
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const offset = this.props.offset;
    const limit = this.props.limit;
    const sortBy = this.props.sort;
    const sortDir = this.props.sortDir;

    this.setState({
      filteredData: [],
      offset,
      limit,
      sort: sortBy,
      sortDir,
      fetchMore: false,
    });

    this.fetchData(
      this.props,
      {
        offset,
        limit,
        sort: sortBy,
        fetchMore: false,
        sortDir,
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.date !== nextProps.params.date) {
      this.setState({
        offset: this.props.offset,
        limit: this.props.limit,
        fetchMore: false,
      });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.params.date !== nextProps.params.date ||
      this.state.offset !== nextState.offset ||
      this.state.sort !== nextState.sort ||
      this.state.sortDir !== nextState.sortDir
    ) {
      this.fetchData(nextProps, nextState);
    }
  }

  /**
   * Fetches the orders based on workflowid and
   * the date provided
   */
  fetchData(props, state) {
    const date = formatDate(props.params.date).format(DATE_FORMATS.URL_FORMAT);

    props.dispatch(
      actions.orders.fetch({
        workflowid: props.id,
        date,
        sort: state.sort,
        desc: state.sortDir,
        offset: state.offset,
        limit: state.limit,
        fetchMore: state.fetchMore,
      })
    );
  }

  handleChangeSort = (sortBy) => {
    const newState = sortBy === this.state.sort ?
      { sortDir: !this.state.sortDir } :
      { sort: sortBy };

    this.setState({ ...newState, ...{ loading: true } });
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

    const cantBatch = selectedData.some(o => (
        !includes(
          ORDER_ACTIONS[this.props.collection.find(order => (
            order.id === parseInt(o, 10))
          ).workflowstatus],
          type
        )
      )
    );

    const originalStatuses = {};

    selectedData.forEach(id => {
      originalStatuses[id] = this.props.collection.find(order => (
        order.id === parseInt(id, 10)
      )).workflowstatus;
    });

    if (!cantBatch) {
      this.props.clearSelection();
      this.props.dispatch(
        actions.orders.action(
          type,
          selectedData,
          originalStatuses,
        )
      );
    } else {
      this._modal = (
        <Error
          onClose={this.handleModalCloseClick}
          message={`There was an error running the ${type} call`}
        />
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

  handleScheduleClick = (order) => {
    this._modal = (
      <Reschedule
        data={order}
        onClose={this.handleModalCloseClick}
      />
    );

    this.context.openModal(this._modal);
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

  renderTable() {
    if (!this.props.collection.length) return <h5> No data found </h5>;

    return (
      <OrdersTable
        linkDate={this.props.linkDate}
        initialFilter={this.props.filterFn}
        onDataFilterChange={this.props.onDataFilterChange}
        collection={this.props.collection}
        setSelectedData={this.props.setSelectedData}
        selectedData={this.props.selectedData}
        onSortChange={this.props.onSortChange}
        sortData={this.props.sortData}
        onScheduleClick={this.handleScheduleClick}
        username={this.props.username}
        onServerSortChange={this.handleChangeSort}
      />
    );
  }

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
    if (!this.props.sync || this.props.loading || this.state.loading) {
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
        { this.renderLoadMore() }
      </div>
    );
  }
}
