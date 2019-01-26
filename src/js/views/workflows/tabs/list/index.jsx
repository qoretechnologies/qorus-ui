// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import mapProps from 'recompose/mapProps';
import { connect } from 'react-redux';
import flowRight from 'lodash/flowRight';
import lifecycle from 'recompose/lifecycle';
import { createSelector } from 'reselect';

import actions from '../../../../store/api/actions';
import { querySelector, resourceSelector } from '../../../../selectors';
import { findBy } from '../../../../helpers/search';
import sync from '../../../../hocomponents/sync';
import patch from '../../../../hocomponents/patchFuncArgs';
import selectable from '../../../../hocomponents/selectable';
import unsync from '../../../../hocomponents/unsync';
import withCSV from '../../../../hocomponents/csv';
import loadMore from '../../../../hocomponents/loadMore';
import withSort from '../../../../hocomponents/sort';
import { sortDefaults } from '../../../../constants/sort';
import Box from '../../../../components/box';
import Table from './table';

type Props = {
  date: string,
  linkDate: string,
  workflow?: Object,
  selected: string,
  fetch: Function,
  onCSVClick: Function,
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
  filter: string,
  isTablet: boolean,
  children?: any,
};

const WorkflowOrders: Function = ({
  selected,
  selectedIds,
  location,
  orders,
  linkDate,
  searchPage,
  limit,
  canLoadMore,
  handleLoadMore,
  sortData,
  onSortChange,
  isTablet,
  onCSVClick,
  workflow,
  children,
}: Props): React.Element<any> => (
  <Box top noPadding>
    <Table
      collection={orders}
      date={linkDate}
      sortData={sortData}
      onSortChange={onSortChange}
      canLoadMore={canLoadMore}
      isTablet={isTablet}
      searchPage={searchPage}
      onCSVClick={onCSVClick}
      workflow={workflow}
      onLoadMore={handleLoadMore}
      selected={selected}
      selectedIds={selectedIds}
      location={location}
      limit={limit}
    >
      {children}
    </Table>
  </Box>
);

const filterOrders: Function = (id): Function => (
  orders: Array<Object>
): Array<Object> =>
  id
    ? orders.filter((order: Object): boolean => order.workflowid === id)
    : orders;

const filterSearch: Function = (search: string): Function => (
  orders: Array<Object>
): Array<Object> => findBy(['id', 'workflowstatus'], search, orders);

const idSelector: Function = (state, props) =>
  props.workflow ? props.workflow.id : null;

const collectionSelector: Function = createSelector(
  [querySelector('search'), resourceSelector('orders'), idSelector],
  (search: string, orders: Object, id: number) =>
    flowRight(
      filterSearch(search),
      filterOrders(id)
    )(orders.data)
);

const settingsSelector = (state: Object): Object => state.ui.settings;

const viewSelector: Function = createSelector(
  [
    resourceSelector('orders'),
    collectionSelector,
    resourceSelector('currentUser'),
    querySelector('filter'),
    settingsSelector,
  ],
  (meta, orders, user, filter, settings) => ({
    meta,
    sort: meta.sort,
    sortDir: meta.sortDir,
    orders,
    user,
    filter,
    isTablet: settings.tablet,
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
  mapProps(
    ({ workflow, ...rest }: Props): Object => ({
      id: workflow ? workflow.id : null,
      workflow,
      ...rest,
    })
  ),
  patch('load', [
    'id',
    false,
    'offset',
    'linkDate',
    'filter',
    'limit',
    'sortDir',
    'sort',
    'searchData',
  ]),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps (nextProps: Props) {
      const {
        id,
        date,
        filter,
        unselectAll,
        fetch,
        sort,
        sortDir,
        offset,
        changeOffset,
        searchData,
      } = this.props;

      //* the only way to check if the searchData object has really changed
      const searchHasChanged: boolean =
        JSON.stringify(searchData) !== JSON.stringify(nextProps.searchData);

      if (
        (date !== nextProps.date || searchHasChanged) &&
        nextProps.offset !== 0
      ) {
        changeOffset(0);
      } else if (
        date !== nextProps.date ||
        filter !== nextProps.filter ||
        sort !== nextProps.sort ||
        sortDir !== nextProps.sortDir ||
        offset !== nextProps.offset ||
        searchHasChanged
      ) {
        fetch(
          id,
          nextProps.offset !== 0,
          nextProps.offset,
          nextProps.linkDate,
          nextProps.filter,
          nextProps.limit,
          nextProps.sortDir,
          nextProps.sort,
          nextProps.searchData
        );
        unselectAll();
      }
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
    'isTablet',
    'searchQuery',
  ]),
  unsync()
)(WorkflowOrders);
