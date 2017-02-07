// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import union from 'lodash/union';
import flowRight from 'lodash/flowRight';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import { createSelector } from 'reselect';

import actions from '../../../../store/api/actions';
import { querySelector, resourceSelector } from '../../../../selectors';
import { ORDER_STATES, CUSTOM_ORDER_STATES } from '../../../../constants/orders';
import { findBy } from '../../../../helpers/search';
import sync from '../../../../hocomponents/sync';
import patch from '../../../../hocomponents/patchFuncArgs';
import selectable from '../../../../hocomponents/selectable';
import unsync from '../../../../hocomponents/unsync';
import withCSV from '../../../../hocomponents/csv';
import loadMore from '../../../../hocomponents/loadMore';
import withSort from '../../../../hocomponents/sort';
import { sortDefaults } from '../../../../constants/sort';
import Toolbar from './toolbar';
import Table from './table';
import { Control } from '../../../../components/controls';

type Props = {
  date: string,
  linkDate: string,
  workflow?: Object,
  selected: string,
  onCSVClick: Function,
  fetch: Function,
  selectedIds: Array<number>,
  unselectAll: Function,
  location: Object,
  orders: Array<Object>,
  changeOffset: Function,
  limit: number,
  searchData?: Object,
  searchPage?: boolean,
  canLoadMore: boolean,
  handleLoadMore: Function,
  sortData: Object,
  onSortChange: Function,
};

const WorkflowOrders: Function = ({
  selected,
  selectedIds,
  onCSVClick,
  location,
  orders,
  linkDate,
  searchPage,
  limit,
  canLoadMore,
  handleLoadMore,
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <div>
    <Toolbar
      selected={selected}
      selectedIds={selectedIds}
      onCSVClick={onCSVClick}
      location={location}
      searchPage={searchPage}
    />
    <Table
      collection={orders}
      date={linkDate}
      sortData={sortData}
      onSortChange={onSortChange}
    />
    { canLoadMore && (
      <Control
        label={`Load ${limit} more...`}
        btnStyle="success"
        big
        onClick={handleLoadMore}
      />
    )}
  </div>
);

const filterOrders: Function = (
  filter: Array<string>
): Function => (orders: Array<Object>): Array<Object> => {
  if (!filter || includes(filter, 'All')) return orders;

  const states = union(ORDER_STATES, CUSTOM_ORDER_STATES);

  return orders.filter(o => (
    includes(filter, states.find((s: Object) => s.name === o.workflowstatus).title))
  );
};

const filterSearch: Function = (
  search: string
): Function => (orders: Array<Object>): Array<Object> => (
  findBy(['id', 'workflowstatus'], search, orders)
);

const collectionSelector: Function = createSelector(
  [
    querySelector('search'),
    querySelector('filter'),
    resourceSelector('orders'),
  ], (search: string, filter: string, orders: Object) => flowRight(
    filterOrders(filter),
    filterSearch(search)
  )(orders.data)
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('orders'),
    collectionSelector,
    resourceSelector('currentUser'),
  ], (meta, orders, user) => ({
    meta,
    sort: meta.sort,
    sortDir: meta.sortDir,
    orders,
    user,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.orders.fetchOrders,
      fetch: actions.orders.fetchOrders,
      unsync: actions.orders.unsync,
      unselectAll: actions.orders.unselectAll,
    }
  ),
  withSort('orders', 'orders', sortDefaults.orders),
  loadMore('orders', 'orders'),
  mapProps(({ workflow, ...rest }: Props): Object => ({
    id: workflow ? workflow.id : null,
    workflow,
    ...rest,
  })),
  patch('load', [
    'id',
    false,
    'offset',
    'linkDate',
    'limit',
    'sortDir',
    'sort',
    'searchData',
  ]),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const {
        id,
        date,
        unselectAll,
        fetch,
        sort,
        sortDir,
        offset,
        changeOffset,
        searchData,
      } = this.props;

      if ((date !== nextProps.date || searchData !== nextProps.searchData)
      && nextProps.offset !== 0) {
        changeOffset(0);
      } else if (
        date !== nextProps.date ||
        sort !== nextProps.sort ||
        sortDir !== nextProps.sortDir ||
        offset !== nextProps.offset ||
        searchData !== nextProps.searchData
      ) {
        fetch(
          id,
          nextProps.offset !== 0,
          nextProps.offset,
          nextProps.linkDate,
          nextProps.limit,
          nextProps.sortDir,
          nextProps.sort,
          nextProps.searchData,
        );
        unselectAll();
      }
    },
  }),
  withHandlers({
    handleMoreClick: ({ changeOffset }: Props): Function => (): void => {
      changeOffset();
    },
  }),
  selectable('orders'),
  withCSV('orders', 'orders'),
  pure([
    'sortData',
    'workflow',
    'orders',
    'selected',
    'selectedIds',
    'date',
    'linkDate',
    'offset',
    'limit',
    'sort',
    'sortDir',
  ]),
  unsync(),
)(WorkflowOrders);
