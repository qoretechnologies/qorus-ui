// @flow
import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { findBy } from '../../helpers/search';
import loadMore from '../../hocomponents/loadMore';
import sort from '../../hocomponents/sort';

export type EnhancedTableProps = {
  collection: Array<Object>,
  searchBy?: Array<string>,
  handleSearchChange: Function,
  handleLoadMore: Function,
  handleLoadAll: Function,
  loadMoreTotal: number,
  loadMoreCurrent: number,
  limit: number,
  children: Function,
  search: string,
  changeSearch: Function,
  canLoadMore: boolean,
  sortData: Object,
  onSortChange: Function,
};

const EnhancedTable: Function = ({
  children,
  ...rest
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: EnhancedTableProps): React.Element<any> => children(rest);

export default compose(
  mapProps(
    ({ collection, ...rest }: EnhancedTableProps): EnhancedTableProps => ({
      collection: collection || [],
      ...rest,
    })
  ),
  withState('search', 'changeSearch', null),
  withHandlers({
    handleSearchChange: ({ changeSearch }: EnhancedTableProps): Function => (
      value: string
    ): void => {
      changeSearch(() => value);
    },
  }),
  mapProps(
    ({
      collection,
      search,
      searchBy,
      ...rest
    }: EnhancedTableProps): EnhancedTableProps => ({
      collection:
        search && searchBy && search !== ''
          ? findBy(searchBy, search, collection)
          : collection,
      search,
      ...rest,
    })
  ),
  loadMore('collection', null, true, 50),
  sort(
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'tableId' does not exist on type 'Enhance... Remove this comment to see the full error message
    ({ tableId }: EnhancedTableProps) => tableId,
    'collection',
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sortDefault' does not exist on type 'Enh... Remove this comment to see the full error message
    ({ sortDefault }: EnhancedTableProps) => sortDefault
  )
)(EnhancedTable);
