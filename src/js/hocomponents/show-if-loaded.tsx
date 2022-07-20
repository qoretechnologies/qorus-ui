/* @flow */
import React from 'react';
import Loader from '../components/loader';
import Preloader from '../components/preloader';
import showIfPassed from './show-if-passed';

/**
 * Return high order components that check is data under propName has been loaded
 * or not
 * @param {string} propName
 * @return {Function} - High order component
 */
export default (propName: string, bigLoader: boolean = false): Function =>
  (
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
    Component
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  ) => {
    // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
    const WrappedComponent = showIfPassed(
      (props) => props[propName] && props[propName].sync && !props[propName].loading,
      bigLoader ? <Preloader /> : <Loader />
    )(Component);

    WrappedComponent.displayName = `showIfLoaded(${propName})(${Component.displayName})`;

    return WrappedComponent;
  };
