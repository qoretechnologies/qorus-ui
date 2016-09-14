/* @flow */
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';

import showIfPassed from './show-if-passed';

export default (
  condition: Function,
  noDataElement: React.Element<*> = <p className="no-data">No data</p>
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  const NewComponent = showIfPassed(condition, noDataElement)(Component);
  NewComponent.displayName = wrapDisplayName(NewComponent, 'checkNoData');
  return NewComponent;
};
