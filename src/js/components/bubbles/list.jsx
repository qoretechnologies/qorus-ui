/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

const BubbleList = ({ children }: { children?: any }): React.Element<any> => (
  <div className="bubbles">
    {children}
  </div>
);

export default pure(['children'])(BubbleList);
