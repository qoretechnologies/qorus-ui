/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

// @ts-ignore ts-migrate(2724) FIXME: 'React' has no exported member named 'Element'. Di... Remove this comment to see the full error message
const BubbleList = ({ children }: { children?: any }): React.Element<any> => (
  <div className="bubbles">{children}</div>
);

export default pure(['children'])(BubbleList);
