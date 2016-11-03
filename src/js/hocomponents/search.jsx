import React, { PropTypes } from 'react';
import { changeQuery } from '../helpers/router';

export default (
  queryName: string = 'q',
  customFunc: Function,
): Function => (Component: any): ?React.Element<any> => {
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

    handleSearch: Function = (querySearch): void => {
      changeQuery(
        this.context.router,
        this.props.location || this.context.location,
        {
          [queryName]: querySearch,
        }
      );
    };

    render() {
      const func = customFunc || this.handleSearch;
      const query = this.props.location.query[queryName];

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
