/* @flow */
import React from 'react';

/**
 * Check if condition passed then show component, else display otherElement
 * @param {Function} condition - takes props and returns (does condition passed or not)
 * @param {ReactElement} otherElement - element displayed if condition doesn't passed
 * @return {Function} - High order component that will check current condition
 */
export default (
  condition: Function,
  otherElement: ?React.Element<*>
): Function => (
  Component: ReactClass<*>
): ReactClass<*> => (
  props: Object
) => {
  if (condition(props)) {
    return <Component {...props} />;
  }
  return otherElement || null;
};
