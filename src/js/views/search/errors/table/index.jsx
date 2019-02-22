// @flow
import React from 'react';
import compose from 'recompose/compose';
import pure from 'recompose/onlyUpdateForKeys';
import { connect } from 'react-redux';
import lifecycle from 'recompose/lifecycle';
import withHandlers from 'recompose/withHandlers';
import { createSelector } from 'reselect';

import actions from '../../../../store/api/actions';
import { querySelector, resourceSelector } from '../../../../selectors';
import sync from '../../../../hocomponents/sync';
import patch from '../../../../hocomponents/patchFuncArgs';
import unsync from '../../../../hocomponents/unsync';
import withCSV from '../../../../hocomponents/csv';
import loadMore from '../../../../hocomponents/loadMore';
import withSort from '../../../../hocomponents/sort';
import { sortDefaults } from '../../../../constants/sort';
import Table from './table';

type Props = {
  onCSVClick: Function,
  fetch: Function,
  location: Object,
  orderErrors: Array<Object>,
  changeOffset: Function,
  limit: number,
  searchData?: Object,
  searchPage?: boolean,
  canLoadMore: boolean,
  handleLoadMore: Function,
  loadMoreCurrent: number,
  sortData: Object,
  onSortChange: Function,
  filter: string,
  children: any,
};

const WorkflowOrders: Function = ({
  onCSVClick,
  children,
  orderErrors,
  limit,
  canLoadMore,
  handleLoadMore,
  loadMoreCurrent,
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <Table
    collection={orderErrors}
    sortData={sortData}
    onSortChange={onSortChange}
    canLoadMore={canLoadMore}
    handleLoadMore={handleLoadMore}
    loadMoreCurrent={loadMoreCurrent}
    limit={limit}
    onCSVClick={onCSVClick}
  >
    {children}
  </Table>
);

const viewSelector: Function = createSelector(
  [
    resourceSelector('orderErrors'),
    resourceSelector('currentUser'),
    querySelector('filter'),
  ],
  (meta, orders, user, filter) => ({
    meta,
    orderErrors: meta.data,
    user,
    filter,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.orderErrors.fetchOrderErrors,
      fetch: actions.orderErrors.fetchOrderErrors,
      unsync: actions.orderErrors.unsync,
      loadWfs: actions.workflows.fetch,
    }
  ),
  withSort('orderErrors', 'orderErrors', sortDefaults.orderErrors),
  loadMore('orderErrors', 'orderErrors'),
  patch('load', [false, 'offset', 'filter', 'limit', 'searchData']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps (nextProps: Props) {
      const { filter, fetch, offset, changeOffset, searchData } = this.props;

      //* the only way to check if the searchData object has really changed
      const searchHasChanged: boolean =
        JSON.stringify(searchData) !== JSON.stringify(nextProps.searchData);

      if (searchHasChanged && nextProps.offset !== 0) {
        changeOffset(0);
      } else if (
        filter !== nextProps.filter ||
        offset !== nextProps.offset ||
        searchHasChanged
      ) {
        fetch(
          nextProps.offset !== 0,
          nextProps.offset,
          nextProps.filter,
          nextProps.limit,
          nextProps.searchData
        );
      }
    },
  }),
  withHandlers({
    handleMoreClick: ({ changeOffset }: Props): Function => (): void => {
      changeOffset();
    },
  }),
  withCSV('orderErrors', 'orderErrors'),
  unsync(),
  pure([
    'location',
    'orderErrors',
    'offset',
    'limit',
    'searchData',
    'filter',
    'sortData',
  ])
)(WorkflowOrders);
