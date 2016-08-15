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
    };

    handleSearch: Function = (q): void => {
      goTo(
        this.context.router,
        name,
        path,
        this.props.params,
        {},
        { q },
      );
    };

    render() {
      const func = customFunc || this.handleSearch;

      return (
        <Component onSearchChange={func} {...this.props} />
      );
    }
  }

  WrappedComponent.displayName = `search(${Component.displayName})`;

  return WrappedComponent;
};
