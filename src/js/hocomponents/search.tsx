/* @flow */
import PropTypes from 'prop-types';
import React from 'react';

import { changeQuery } from '../helpers/router';

export default (
  queryName: string | Function = () => 'q',
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  customFunc: ?Function
// @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
): Function => (Component: any): ?ReactClass<*> => {
  class WrappedComponent extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
      location: PropTypes.object,
    };

    props: {
      location: Object,
      query: string,
    } = this.props;

    getQueryName: Function = (qn: string | Function): string =>
      typeof qn === 'function' ? qn(this.props) : qn;

    handleSearch: Function = (querySearch): void => {
      const query = this.getQueryName(queryName);

      changeQuery(
        this.context.router,
        this.props.location || this.context.location,
        {
          [query]: querySearch,
        }
      );
    };

    render() {
      const func = customFunc || this.handleSearch;
      const qName = this.getQueryName(queryName);
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type 'Object'.
      const query = this.props.location.query[qName];

      return (
        <Component
          onSearchChange={func}
          defaultSearchValue={this.props.query || ''}
          query={query}
          {...this.props}
        />
      );
    }
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'displayName' does not exist on type 'typ... Remove this comment to see the full error message
  WrappedComponent.displayName = `search(${Component.displayName})`;

  return WrappedComponent;
};
