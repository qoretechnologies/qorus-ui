import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import compose from 'recompose/compose';
import moment from 'moment';
import { flowRight, isEqual } from 'lodash';

import { normalizeName } from '../../store/api/resources/utils';
import actions from 'store/api/actions';
import SearchToolbar from './toolbar';
import OrdersTable from '../old_workflow/tabs/list/table';
import Loader from '../../components/loader';
import Reschedule from '../old_workflow/tabs/list/modals/reschedule';
import { Control as Button } from 'components/controls';
import { goTo } from '../../helpers/router';
import sort from '../../hocomponents/sort';
import { DATE_FORMATS } from '../../constants/dates';

const normalize = (orders) => orders.map(o => {
  if (o.normalizedName) return o;

  return normalizeName(o);
});

const orderSelector = state => state.api.orders;
const userSelector = state => state.api.currentUser.data.username;

const collectionSelector = createSelector(
  [
    orderSelector,
  ], (orders) => flowRight(
    normalize
  )(orders.data)
);

const selector = createSelector(
  [
    orderSelector,
    collectionSelector,
    userSelector,
  ], (ordersData, collection, username) => ({
    sync: ordersData.sync,
    loading: ordersData.loading,
    collection,
    username,
  })
);

@compose(
  connect(selector),
  sort('orders', 'collection')
)
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
    onSortChange: PropTypes.func,
    username: PropTypes.string,
    offset: PropTypes.number,
    limit: PropTypes.number,
    linkDate: PropTypes.string,
    route: PropTypes.object,
  };

  static defaultProps = {
    offset: 0,
    limit: 100,
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
      search: false,
    });

    this.fetchData(this.props, { offset, limit, fetchMore: false });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.location.query, nextProps.location.query)) {
      const state = {
        limit: this.props.limit,
        offset: this.props.offset,
        fetchMore: false,
      };

      this.setState(state);
      this.fetchData(nextProps, state);
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

    if (Object.keys(query).length && !Object.keys(query).every(k => query[k] === '')) {
      query.date = !query.date || query.date === '' ?
        moment().add(-1, 'weeks').format(DATE_FORMATS.DISPLAY) :
        query.date;

      props.dispatch(
        actions.orders.fetch(Object.assign({}, {
          sort: 'started',
          offset: state.offset,
          limit: state.limit,
          fetchMore: state.fetchMore,
        }, query))
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

  handleModalCloseClick = () => {
    this.context.closeModal(this._modal);
  };

  handleCSVClick = () => {
    const collection = this.state.filteredData.length ?
      this.state.filteredData : this.props.collection;

    this.props.onCSVClick(collection, 'search');
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

    const defaultDate = moment().add(-1, 'weeks').format(DATE_FORMATS.URL_FORMAT);
    const { date = defaultDate } = this.props.location.query;

    return (
      <OrdersTable
        noCheckbox
        linkDate={this.props.linkDate || date}
        initialFilter={this.props.filterFn}
        onDataFilterChange={this.props.onDataFilterChange}
        collection={this.props.collection}
        setSelectedData={this.props.setSelectedData}
        selectedData={this.props.selectedData}
        onSortChange={this.props.onSortChange}
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
          onCSVClick={this.handleCSVClick}
          {...this.props.location.query}
        />
        <div className="view-content">
          { this.renderTable() }
          { this.renderLoadMore() }
        </div>
      </div>
    );
  }
}
