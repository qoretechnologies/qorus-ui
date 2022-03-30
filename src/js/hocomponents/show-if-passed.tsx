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
  // @ts-expect-error ts-migrate(8020) FIXME: JSDoc types can only be used inside documentation ... Remove this comment to see the full error message
  otherElement: ?React.Element<*>
): Function => (
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  Component: ReactClass<*>
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
): ReactClass<*> => (
  props: Object
) => {
  if (condition(props)) {
    return <Component {...props} />;
  }
  return otherElement || null;
};
