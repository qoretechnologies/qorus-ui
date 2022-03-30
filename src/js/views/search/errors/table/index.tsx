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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
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
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orderErrors' does not exist on type '{}'... Remove this comment to see the full error message
      load: actions.orderErrors.fetchOrderErrors,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orderErrors' does not exist on type '{}'... Remove this comment to see the full error message
      fetch: actions.orderErrors.fetchOrderErrors,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'orderErrors' does not exist on type '{}'... Remove this comment to see the full error message
      unsync: actions.orderErrors.unsync,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'workflows' does not exist on type '{}'.
      loadWfs: actions.workflows.fetch,
    }
  ),
  withSort('orderErrors', 'orderErrors', sortDefaults.orderErrors),
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
  loadMore('orderErrors', 'orderErrors'),
  patch('load', [false, 'offset', 'filter', 'limit', 'searchData']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps (nextProps: Props) {
      const { filter, fetch, offset, changeOffset, searchData } = this.props;

      //* the only way to check if the searchData object has really changed
      const searchHasChanged: boolean =
        JSON.stringify(searchData) !== JSON.stringify(nextProps.searchData);

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
      if (searchHasChanged && nextProps.offset !== 0) {
        changeOffset(0);
      } else if (
        filter !== nextProps.filter ||
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
        offset !== nextProps.offset ||
        searchHasChanged
      ) {
        fetch(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
          nextProps.offset !== 0,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'offset' does not exist on type 'Props'.
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
