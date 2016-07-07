import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { flowRight, includes, union, isEqual } from 'lodash';
import { normalizeName } from '../../store/api/resources/utils';

import actions from 'store/api/actions';
import * as ui from 'store/ui/actions';
import { ORDER_STATES, CUSTOM_ORDER_STATES } from '../../constants/orders';

import SearchToolbar from './toolbar';
import OrdersTable from '../workflow/tabs/list/table';
import Loader from '../../components/loader';
import Reschedule from '../workflow/tabs/list/modals/reschedule';
import { Control as Button } from 'components/controls';

import { findBy } from '../../helpers/search';
import { sortTable } from '../../helpers/table';
import { goTo } from '../../helpers/router';

const filterOrders = (filter) => (orders) => {
  if (!filter || includes(filter, 'All')) return orders;

  const states = union(ORDER_STATES, CUSTOM_ORDER_STATES);

  return orders.filter(o => (
    includes(filter, states.find(s => s.name === o.workflowstatus).title))
  );
};

const filterSearch = (search) => (orders) => findBy(['id', 'workflowstatus'], search, orders);
const sortOrders = (sortData) => (orders) => sortTable(orders, sortData);
const normalize = (orders) => orders.map(o => {
  if (o.normalizedName) return o;

  return normalizeName(o);
});

const orderSelector = state => state.api.orders;
const filterSelector = (state, props) => props.params.filter;
const searchSelector = (state, props) => props.location.query.q;
const sortSelector = state => state.ui.orders;
const userSelector = state => state.api.currentUser.data.username;

const collectionSelector = createSelector(
  [
    orderSelector,
    filterSelector,
    searchSelector,
    sortSelector,
  ], (orders, filter, search, sortData) => flowRight(
    sortOrders(sortData),
    filterSearch(search),
    filterOrders(filter),
    normalize
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

@connect(selector)
export default class SearchView extends Component {
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
    username: PropTypes.string,
    offset: PropTypes.number,
    limit: PropTypes.number,
    linkDate: PropTypes.string,
    route: PropTypes.object,
  };

  static defaultProps = {
    offset: 0,
    limit: 2,
  };

  static contextTypes = {
    router: PropTypes.object,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
    location: PropTypes.object,
    params: PropTypes.object,
    route: PropTypes.object,
  };

  getChildContext() {
    return {
      dispatch: this.props.dispatch,
      location: this.props.location,
      params: this.props.params,
      route: this.props.route,
    };
  }

  componentWillMount() {
    const offset = this.props.offset;
    const limit = this.props.limit;

    this.setState({
      filteredData: [],
      offset,
      limit,
      fetchMore: false,
    });

    this.fetchData(this.props, { offset, limit, fetchMore: false });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.location.query, nextProps.location.query)) {
      this.fetchData(nextProps, this.state);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.offset !== nextState.offset) {
      this.fetchData(nextProps, nextState);
    }
  }

  /**
   * Fetches the orders based on workflowid and
   * the date provided
   */
  fetchData(props, state) {
    const { query } = props.location;

    if (!Object.keys(query).length || !Object.keys(query).every(k => query[k] === '')) {
      props.dispatch(
        actions.orders.fetch(Object.assign({}, {
          sort: 'started',
          offset: state.offset,
          limit: state.limit,
          fetchMore: state.fetchMore,
        }, props.location.query))
      );

      this.setState({
        search: true,
      });
    } else {
      this.setState({
        search: false,
      });
    }
  }

  handleSortChange = (sortChange) => {
    this.props.dispatch(
      ui.orders.sort(sortChange)
    );
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

  handleSearchChange = (search) => {
    goTo(
      this.context.router,
      this.state.name,
      this.props.route.path,
      this.props.params,
      {},
      search,
    );
  };

  renderTable() {
    if (!this.state.search) return <p> Type instance ID or keyvalue to begin the search </p>;

    if (!this.props.sync || this.props.loading) return <Loader />;

    if (!this.props.collection.length) return <h5> No data found </h5>;

    return (
      <OrdersTable
        noCheckbox
        linkDate={this.props.linkDate}
        initialFilter={this.props.filterFn}
        onDataFilterChange={this.props.onDataFilterChange}
        collection={this.props.collection}
        setSelectedData={this.props.setSelectedData}
        selectedData={this.props.selectedData}
        onSortChange={this.handleSortChange}
        sortData={this.props.sortData}
        onScheduleClick={this.handleScheduleClick}
        username={this.props.username}
      />
    );
  }

  renderLoadMore() {
    if (this.props.collection.length < (this.state.limit + this.state.offset) ||
        !this.state.search) {
      return undefined;
    }

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
    return (
      <div className="workflow-detail-tab">
        <SearchToolbar
          onSubmit={this.handleSearchChange}
          {...this.props.location.query}
        />
        { this.renderTable() }
        { this.renderLoadMore() }
      </div>
    );
  }
}
