import React, { PropTypes } from 'react';
import { goTo } from '../helpers/router';

export default (
  name: string,
  path: string,
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

    handleSearch: Function = (q): void => {
      const { router } = this.context;
      const { params, location } = this.props;
      goTo(
        router,
        name,
        path,
        params,
        {},
        { ...location.query, q },
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
