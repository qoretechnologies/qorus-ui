/* @flow */
import React from 'react';
import Loader from '../components/loader';

/**
 * Returns high order component that need to sync data.
 * if props[propName] doesn't synced or loaded then call load action.
 * if showLoader is true then show Loader instead Component while loading
 * @param {string} propName - property that should be checked.
 * @param {bool} showLoader - show loader or not
 * @param {Function} loadFunc - custom loading function
 */
export default (
  propName: string,
  showLoader: boolean = true,
  loadFunc: ?string = null
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  class WrappedComponent extends React.Component {
    state: {
      hasStartedLoading: boolean,
    } = {
      hasStartedLoading: false,
    };

    componentDidMount () {
      const load = this.props[loadFunc] || this.props.load;
      const value = this.props[propName];

      if (!value.loading && !value.sync) {
        this.setState(state => ({
          ...state,
          hasStartedLoading: true,
        }));
        load();
      }
    }

    componentDidUpdate (nextProps) {
      const load = nextProps[loadFunc] || nextProps.load;
      const value = nextProps[propName];

      if (!this.state.hasStartedLoading) {
        this.setState(state => ({
          ...state,
          hasStartedLoading: true,
        }));
        load();
      }
    }

    render () {
      if (showLoader && !this.props[propName].sync) {
        return <Loader />;
      }

      return <Component {...this.props} />;
    }
  }

  WrappedComponent.displayName = `sync(${Component.displayName})`;
  return WrappedComponent;
};
