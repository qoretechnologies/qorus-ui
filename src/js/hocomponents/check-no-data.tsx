/* @flow */
import React from 'react';
import wrapDisplayName from 'recompose/wrapDisplayName';
import NoData from '../components/nodata';

import showIfPassed from './show-if-passed';

export default (
  condition: Function,
  // @ts-expect-error ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
  noDataElement: React.Element<*> = <NoData />
// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
): Function => (Component: ReactClass<*>): ReactClass<*> => {
  const NewComponent = showIfPassed(condition, noDataElement)(Component);
  NewComponent.displayName = wrapDisplayName(NewComponent, 'checkNoData');
  return NewComponent;
};
