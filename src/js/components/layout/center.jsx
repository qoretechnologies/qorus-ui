/* @flow */
import React from 'react';

const CenterWrapper = ({ children }: { children: Array<ReactClass<*>> }) => (
  <div className="center-wrapper">{children}</div>
);

export default CenterWrapper;
