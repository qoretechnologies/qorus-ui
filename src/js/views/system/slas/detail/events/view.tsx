// @flow
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import { createSelector } from 'reselect';
// @ts-ignore ts-migrate(2306) FIXME: File '/workspace/qorus-webapp/src/js/components/co... Remove this comment to see the full error message
import { Control as Button } from '../../../../../components/controls';
import Flex from '../../../../../components/Flex';
import NoData from '../../../../../components/nodata';
import { sortDefaults } from '../../../../../constants/sort';
import loadMore from '../../../../../hocomponents/loadMore';
import patch from '../../../../../hocomponents/patchFuncArgs';
import withSort from '../../../../../hocomponents/sort';
import sync from '../../../../../hocomponents/sync';
import unsync from '../../../../../hocomponents/unsync';
import { resourceSelector } from '../../../../../selectors';
import actions from '../../../../../store/api/actions';
import EventsTable from './table';

type Props = {
  location: any;
  params: any;
  id: number;
  searchData: any;
  sort: string;
  sortDir: string;
  offset: number;
  limit: number;
  canLoadMore: boolean;
  handleLoadMore: Function;
  sortData: any;
  onSortChange: Function;
  collection: Array<Object>;
  defaultDate: string;
};

const EventsView: Function = ({
  limit,
  canLoadMore,
  handleLoadMore,
  sortData,
  onSortChange,
  collection,
}: // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
Props) => (
  <Flex display="flex">
    {collection.length ? (
      <EventsTable
        sortData={sortData}
        onSortChange={onSortChange}
        collection={collection}
        canLoadMore={canLoadMore}
      />
    ) : (
      <NoData />
    )}
    {canLoadMore && <Button label={`Load ${limit} more...`} big onClick={handleLoadMore} />}
  </Flex>
);

const viewSelector: Function = createSelector(
  [resourceSelector('slaevents')],
  (meta: any): any => ({
    meta,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'data' does not exist on type 'Object'.
    collection: meta.data,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sort' does not exist on type 'Object'.
    sort: meta.sort,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'sortDir' does not exist on type 'Object'... Remove this comment to see the full error message
    sortDir: meta.sortDir,
  })
);

export default compose(
  connect(viewSelector, {
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slaevents' does not exist on type '{}'.
    load: actions.slaevents.fetchEvents,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slaevents' does not exist on type '{}'.
    fetch: actions.slaevents.fetchEvents,
    // @ts-ignore ts-migrate(2339) FIXME: Property 'slaevents' does not exist on type '{}'.
    unsync: actions.slaevents.unsync,
  }),
  mapProps(
    ({ params, ...rest }: Props): Props => ({
      // @ts-ignore ts-migrate(2339) FIXME: Property 'id' does not exist on type 'Object'.
      id: params.id,
      params,
      ...rest,
    })
  ),
  withSort('slaevents', 'collection', sortDefaults.slaevents),
  // @ts-ignore ts-migrate(2554) FIXME: Expected 4 arguments, but got 2.
  loadMore('collection', 'slaevents'),
  patch('load', ['id', false, 'offset', 'limit', 'sortDir', 'sort', 'searchData']),
  sync('meta'),
  lifecycle({
    componentWillReceiveProps(nextProps: Props) {
      const { sort, sortDir, id, changeOffset, offset, searchData, fetch } = this.props;

      if (
        // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
        (searchData.err !== nextProps.searchData.err ||
          // @ts-ignore ts-migrate(2339) FIXME: Property 'errDesc' does not exist on type 'Object'... Remove this comment to see the full error message
          searchData.errDesc !== nextProps.searchData.errDesc ||
          // @ts-ignore ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message
          searchData.producer !== nextProps.searchData.producer ||
          // @ts-ignore ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Object'... Remove this comment to see the full error message
          searchData.minDate !== nextProps.searchData.minDate ||
          // @ts-ignore ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Object'... Remove this comment to see the full error message
          searchData.maxDate !== nextProps.searchData.maxDate) &&
        nextProps.offset !== 0
      ) {
        changeOffset(0);
      } else if (
        sort !== nextProps.sort ||
        sortDir !== nextProps.sortDir ||
        offset !== nextProps.offset ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'err' does not exist on type 'Object'.
        searchData.err !== nextProps.searchData.err ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'errDesc' does not exist on type 'Object'... Remove this comment to see the full error message
        searchData.errDesc !== nextProps.searchData.errDesc ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'producer' does not exist on type 'Object... Remove this comment to see the full error message
        searchData.producer !== nextProps.searchData.producer ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Object'... Remove this comment to see the full error message
        searchData.minDate !== nextProps.searchData.minDate ||
        // @ts-ignore ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Object'... Remove this comment to see the full error message
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
  pure(['sortData', 'searchData', 'offset', 'limit', 'sort', 'sortDir', 'collection', 'id'])
)(EventsView);
