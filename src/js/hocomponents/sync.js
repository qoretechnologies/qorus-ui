/* @flow */
import React, { PropTypes } from 'react';

import showIfLoaded from './show-if-loaded';


/**
 * Returns high order component that need to sync data.
 * if props[propName] doesn't synced or loaded then call load action.
 * if showLoader is true then show Loader instead Component while loading
 * @param {string} propName - property that should be checked.
 * @param {bool} showLoader - show loader or not
 */
export default (
  propName: string,
  showLoader : bool = true
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  const LoadComponent = showLoader ? showIfLoaded(propName)(Component) : Component;

  class WrappedComponent extends React.Component {
    componentDidMount() {
      const { load } = this.props;
      const value = this.props[propName];

      if (!value.loading && !value.sync) {
        load();
      }
    }

    render() {
      return <LoadComponent {...this.props} />;
    }
  }
  WrappedComponent.propTypes = {
    load: PropTypes.func,
    [propName]: PropTypes.object,
  };

  WrappedComponent.displayName = `sync(${Component.displayName})`;
  return WrappedComponent;
};
