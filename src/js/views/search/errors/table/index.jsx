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
import Toolbar from './toolbar';
import Table from './table';
import { Control } from '../../../../components/controls';

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
  sortData: Object,
  onSortChange: Function,
  filter: string,
};

const WorkflowOrders: Function = ({
  onCSVClick,
  location,
  orderErrors,
  searchPage,
  limit,
  canLoadMore,
  handleLoadMore,
  sortData,
  onSortChange,
}: Props): React.Element<any> => (
  <div>
    <Toolbar
      onCSVClick={onCSVClick}
      location={location}
      searchPage={searchPage}
    />
    <Table
      collection={orderErrors}
      sortData={sortData}
      onSortChange={onSortChange}
      canLoadMore={canLoadMore}
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

const viewSelector: Function = createSelector(
  [
    resourceSelector('orderErrors'),
    resourceSelector('currentUser'),
    querySelector('filter'),
  ], (meta, orders, user, filter) => ({
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
  patch('load', [
    false,
    'offset',
    'filter',
    'limit',
    'searchData',
  ]),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const {
        filter,
        fetch,
        offset,
        changeOffset,
        searchData,
      } = this.props;

      if ((searchData !== nextProps.searchData)
      && nextProps.offset !== 0) {
        changeOffset(0);
      } else if (
        filter !== nextProps.filter ||
        offset !== nextProps.offset ||
        searchData !== nextProps.searchData
      ) {
        fetch(
          nextProps.offset !== 0,
          nextProps.offset,
          nextProps.filter,
          nextProps.limit,
          nextProps.searchData,
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
