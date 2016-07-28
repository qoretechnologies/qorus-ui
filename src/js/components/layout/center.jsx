/* @flow */
import React from 'react';

const CenterWrapper: Function = (
  { children }: { children: Array<ReactClass<*>> }
): React.Element<any> => (
  <div className="center-wrapper">{children}</div>
);

export default CenterWrapper;
