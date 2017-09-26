// @flow
import React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import lifecycle from 'recompose/lifecycle';
import { createSelector } from 'reselect';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';

import { resourceSelector } from '../../../../../selectors';
import actions from '../../../../../store/api/actions';
import withSort from '../../../../../hocomponents/sort';
import loadMore from '../../../../../hocomponents/loadMore';
import patch from '../../../../../hocomponents/patchFuncArgs';
import sync from '../../../../../hocomponents/sync';
import unsync from '../../../../../hocomponents/unsync';
import { Control as Button } from '../../../../../components/controls';
import { sortDefaults } from '../../../../../constants/sort';
import EventsTable from './table';

type Props = {
  location: Object,
  params: Object,
  id: number,
  searchData: Object,
  sort: string,
  sortDir: string,
  offset: number,
  limit: number,
  canLoadMore: boolean,
  handleLoadMore: Function,
  sortData: Object,
  onSortChange: Function,
  collection: Array<Object>,
  defaultDate: string,
};

const EventsView: Function = ({
  limit,
  canLoadMore,
  handleLoadMore,
  sortData,
  onSortChange,
  collection,
}: Props): React.Element<any> => (
  <div>
    <EventsTable
      sortData={sortData}
      onSortChange={onSortChange}
      collection={collection}
      canLoadMore={canLoadMore}
    />
    {canLoadMore && (
      <Button
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
    resourceSelector('slaevents'),
  ], (meta: Object): Object => ({
    meta,
    collection: meta.data,
    sort: meta.sort,
    sortDir: meta.sortDir,
  })
);

export default compose(
  connect(
    viewSelector,
    {
      load: actions.slaevents.fetchEvents,
      fetch: actions.slaevents.fetchEvents,
      unsync: actions.slaevents.unsync,
    }
  ),
  mapProps(({ params, ...rest }: Props): Props => ({
    id: params.id,
    params,
    ...rest,
  })),
  withSort('slaevents', 'collection', sortDefaults.slaevents),
  loadMore('collection', 'slaevents'),
  patch('load', [
    'id',
    false,
    'offset',
    'limit',
    'sortDir',
    'sort',
    'searchData',
  ]),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { sort, sortDir, id, changeOffset, offset, searchData, fetch } = this.props;

      if ((searchData.err !== nextProps.searchData.err ||
        searchData.errDesc !== nextProps.searchData.errDesc ||
        searchData.producer !== nextProps.searchData.producer ||
        searchData.minDate !== nextProps.searchData.minDate ||
        searchData.maxDate !== nextProps.searchData.maxDate) && nextProps.offset !== 0
      ) {
        changeOffset(0);
      } else if (
        sort !== nextProps.sort ||
        sortDir !== nextProps.sortDir ||
        offset !== nextProps.offset ||
        searchData.err !== nextProps.searchData.err ||
        searchData.errDesc !== nextProps.searchData.errDesc ||
        searchData.producer !== nextProps.searchData.producer ||
        searchData.minDate !== nextProps.searchData.minDate ||
        searchData.maxDate !== nextProps.searchData.maxDate
      ) {
        fetch(
          id,
          nextProps.offset !== 0,
          nextProps.offset,
          nextProps.limit,
          nextProps.sortDir,
          nextProps.sort,
          nextProps.searchData
        );
      }
    },
  }),
  unsync(),
  pure([
    'sortData',
    'searchData',
    'offset',
    'limit',
    'sort',
    'sortDir',
    'collection',
    'id',
  ]),
)(EventsView);
