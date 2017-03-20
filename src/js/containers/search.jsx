// @flow
import React from 'react';
import compose from 'recompose/compose';
import mapProps from 'recompose/mapProps';
import pure from 'recompose/onlyUpdateForKeys';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';

import Search from '../components/search';
import actions from '../store/api/actions';

type Props = {
  pullLeft?: boolean,
  onSearchUpdate: Function,
  handleSearchUpdate: Function,
  defaultValue?: string,
  resource?: string,
  storage: Object,
  username: string,
  storeSearch: Function,
};

const SearchContainer: Function = ({
  handleSearchUpdate,
  ...rest
}: Props): React.Element<any> => (
  <Search
    {...rest}
    onSearchUpdate={handleSearchUpdate}
  />
);

export default compose(
  connect(
    (state: Object): Object => ({
      username: state.api.currentUser.data.username,
      storage: state.api.currentUser.data.storage || {},
    }),
    {
      storeSearch: actions.currentUser.storeSearch,
    }
  ),
  mapProps(({ storage, resource, ...rest }: Props) => ({
    searches: storage[resource] && storage[resource].searches || null,
    resource,
    ...rest,
  })),
  withHandlers({
    handleSearchUpdate: ({
      resource,
      username,
      storeSearch,
      onSearchUpdate,
    }: Props): Function => (query: ?string, save: boolean): void => {
      if (resource && save && query !== '') {
        storeSearch(resource, query, username);
      }

      onSearchUpdate(query);
    },
  }),
  pure([
    'pullLeft',
    'defaultValue',
    'storage',
    'searches',
  ])
)(SearchContainer);
