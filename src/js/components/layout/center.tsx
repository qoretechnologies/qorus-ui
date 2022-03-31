/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

const CenterWrapper: Function = (
  // @ts-ignore ts-migrate(2304) FIXME: Cannot find name 'ReactClass'.
  { children }: { children: Array<ReactClass<*>> }
): // @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
React.Element<any> => <div className="center-wrapper">{children}</div>;

export default pure(['children'])(CenterWrapper);
