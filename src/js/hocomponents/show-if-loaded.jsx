/* @flow */
import React, { PropTypes } from 'react';

import showIfPassed from './show-if-passed';
import Loader from '../components/loader';
import Preloader from '../components/preloader';

/**
 * Return high order components that check is data under propName has been loaded
 * or not
 * @param {string} propName
 * @return {Function} - High order component
 */
export default (propName: string, bigLoader: boolean = false): Function => (
  Component: ReactClass<*>
): ReactClass<*> => {
  const WrappedComponent: ReactClass<*> = showIfPassed(
    props =>
      props[propName] && props[propName].sync && !props[propName].loading,
    bigLoader ? <Preloader /> : <Loader />
  )(Component);

  WrappedComponent.propTypes = {
    [propName]: PropTypes.object,
  };

  WrappedComponent.displayName = `showIfLoaded(${propName})(${
    Component.displayName
  })`;

  return WrappedComponent;
};
