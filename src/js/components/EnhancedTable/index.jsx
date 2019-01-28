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
    ({ tableId }: EnhancedTableProps) => tableId,
    'collection',
    ({ sortDefault }: EnhancedTableProps) => sortDefault
  )
)(EnhancedTable);
