// @flow
import flowRight from 'lodash/flowRight';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
import Box from '../../../../components/box';
import { sortDefaults } from '../../../../constants/sort';
import { findBy } from '../../../../helpers/search';
import withCSV from '../../../../hocomponents/csv';
import loadMore from '../../../../hocomponents/loadMore';
import patch from '../../../../hocomponents/patchFuncArgs';
import selectable from '../../../../hocomponents/selectable';
import withSort from '../../../../hocomponents/sort';
import sync from '../../../../hocomponents/sync';
import unsync from '../../../../hocomponents/unsync';
import { querySelector, resourceSelector } from '../../../../selectors';
import actions from '../../../../store/api/actions';
import Table from './table';

type Props = {
  date: string;
  linkDate: string;
  workflow?: any;
  selected: string;
  fetch: Function;
  onCSVClick: Function;
  selectedIds: Array<number>;
  unselectAll: Function;
  location: any;
  orders: Array<Object>;
  changeOffset: Function;
  limit: number;
  searchData?: any;
  searchPage?: boolean;
  canLoadMore: boolean;
  handleLoadMore: Function;
  loadMoreCurrent: number;
  loadMoreTotal: number;
  sortData: any;
  onSortChange: Function;
  filter: string;
  isTablet: boolean;
  children?: any;
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
  loadMoreCurrent,
  loadMoreTotal,
  sortData,
  onSortChange,
  isTablet,
  onCSVClick,
  workflow,
  children,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
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
      loadMoreCurrent={loadMoreCurrent}
      loadMoreTotal={loadMoreTotal}
      location={location}
      limit={limit}
    >
      {children}
    </Table>
  </Box>
);

const filterOrders: Function =
  (id): Function =>
  (orders: Array<Object>): Array<Object> =>
    id
      ? // @ts-ignore ts-migrate(2339) FIXME: Property 'workflowid' does not exist on type 'Obje... Remove this comment to see the full error message
        orders.filter((order: any): boolean => order.workflowid === id)
      : orders;

const filterSearch: Function =
  (search: string): Function =>
  (orders: Array<Object>): Array<Object> =>
    findBy(['id', 'workflowstatus'], search, orders);

const idSelector: Function = (state, props) => (props.workflow ? props.workflow.id : null);

const collectionSelector: Function = createSelector(
  [querySelector('search'), resourceSelector('orders'), idSelector],
  (search: string, orders: any, id: number) =>
    flowRight(
      filterSearch(search),
      filterOrders(id)
      // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    )(orders.data)
);

// @ts-ignore ts-migrate(2339) FIXME: Property 'ui' does not exist on type 'Object'.
const settingsSelector = (state: any): any => state.ui.settings;

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
    // @ts-ignore ts-migrate(2339) FIXME: Property 'tablet' does not exist on type 'Object'.
    isTablet: settings.tablet,
  })
);

export default compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    load: actions.orders.fetchOrders,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    fetch: actions.orders.fetchOrders,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    unsync: actions.orders.unsync,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'orders' does not exist on type '{}'.
    unselectAll: actions.orders.unselectAll,
  }),
  withSort('orders', 'orders', sortDefaults.orders),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
  loadMore('orders', 'orders'),
  mapProps(({ workflow, ...rest }: Props): any => ({
    // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
    id: workflow ? workflow.id : null,
    workflow,
    ...rest,
  })),
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
    componentWillReceiveProps(nextProps: Props) {
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
        // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
        nextProps.offset !== 0
      ) {
        changeOffset(0);
      } else if (
        date !== nextProps.date ||
        filter !== nextProps.filter ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Props'.
        sort !== nextProps.sort ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'sortDir' does not exist on type 'Props'.
        sortDir !== nextProps.sortDir ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
        offset !== nextProps.offset ||
        searchHasChanged
      ) {
        fetch(
          id,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
          nextProps.offset !== 0,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
          nextProps.offset,
          nextProps.linkDate,
          nextProps.filter,
          nextProps.limit,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'sortDir' does not exist on type 'Props'.
          nextProps.sortDir,
          // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Props'.
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
