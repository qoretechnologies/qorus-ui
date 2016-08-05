/* @flow */
import React from 'react';

const BubbleList = ({ children }: { children?: ReactClass<*> }) => (
  <div className="bubbles">
    {children}
  </div>
);

export default BubbleList;
