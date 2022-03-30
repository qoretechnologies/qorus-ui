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
// @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
}: Props): React.Element<any> => (
  <Search {...rest} onSearchUpdate={handleSearchUpdate} />
);

export default compose(
  connect(
    (state: Object): Object => ({
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      username: state.api.currentUser.data.username,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'api' does not exist on type 'Object'.
      storage: state.api.currentUser.data.storage || {},
    }),
    {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentUser' does not exist on type '{}'... Remove this comment to see the full error message
      storeSearch: actions.currentUser.storeSearch,
    }
  ),
  mapProps(({ storage, resource, ...rest }: Props) => ({
    searches: (storage[resource] && storage[resource].searches) || null,
    resource,
    ...rest,
  })),
  withHandlers({
    handleSearchUpdate: ({
      resource,
      username,
      storeSearch,
      onSearchUpdate,
    // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
    }: Props): Function => (query: ?string, save: boolean): void => {
      if (resource && save && query !== '') {
        storeSearch(resource, query, username);
      }

      onSearchUpdate(query);
    },
  }),
  pure(['pullLeft', 'defaultValue', 'storage', 'searches'])
)(SearchContainer);
