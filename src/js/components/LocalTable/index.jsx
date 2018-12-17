// @flow
import React from 'react';
import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import withHandlers from 'recompose/withHandlers';
import { findBy } from '../../helpers/search';
import loadMore from '../../hocomponents/loadMore';
import sort from '../../hocomponents/sort';
import { sortDefaults } from '../../constants/sort';

type LocalTableProps = {
  collection: Array<Object>,
  searchBy?: Array<string>,
  handleSearchChange: Function,
  handleLoadMore: Function,
  handleLoadAll: Function,
  limit: number,
  children: Function,
  search: string,
  changeSearch: Function,
};

const LocalTable: Function = ({
  children,
  ...rest
}: LocalTableProps): React.Element<any> => children(rest);

export default compose(
  withState('search', 'changeSearch', null),
  withHandlers({
    handleSearchChange: ({ changeSearch }: LocalTableProps): Function => (
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
    }: LocalTableProps): LocalTableProps => ({
      collection:
        search && search !== ''
          ? findBy(searchBy, search, collection)
          : collection,
      search,
      ...rest,
    })
  ),
  loadMore('collection', null, true, 50),
  sort(({ tableId }) => tableId, 'collection', sortDefaults.nodes),
  onlyUpdateForKeys(['collection'])
)(LocalTable);
