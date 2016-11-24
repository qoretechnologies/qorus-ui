/* @flow */
import React, { PropTypes } from 'react';
import { changeQuery } from '../helpers/router';

export default (
  queryName: string | Function = () => 'q',
  customFunc: ?Function,
): Function => (Component: any): ?ReactClass<*> => {
  class WrappedComponent extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
      location: PropTypes.object,
    };

    props: {
      route: Object,
      params: Object,
      location: Object,
      query: string,
    };

    getQueryName: Function = (qn: string | Function): string => (
      typeof qn === 'function' ? qn(this.props) : qn
    );

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

  WrappedComponent.displayName = `search(${Component.displayName})`;

  return WrappedComponent;
};
