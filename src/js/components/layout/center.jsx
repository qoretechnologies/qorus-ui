/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

const CenterWrapper: Function = (
  { children }: { children: Array<ReactClass<*>> }
): React.Element<any> => (
  <div className="center-wrapper">{children}</div>
);

export default pure(['children'])(CenterWrapper);
