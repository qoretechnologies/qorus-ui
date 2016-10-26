import React, { PropTypes } from 'react';
import { changeQuery } from '../helpers/router';

export default (
  queryName: string = 'q',
  customFunc: Function,
): Function => (Component: any): ?React.Element<any> => {
  class WrappedComponent extends React.Component {
    static contextTypes = {
      router: PropTypes.object,
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
        this.props.location,
        {
          [queryName]: querySearch,
        }
      );
    };

    render() {
      const func = customFunc || this.handleSearch;

      return (
        <Component
          onSearchChange={func}
          defaultSearchValue={this.props.query || ''}
          {...this.props}
        />
      );
    }
  }

  WrappedComponent.displayName = `search(${Component.displayName})`;

  return WrappedComponent;
};
