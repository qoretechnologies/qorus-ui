/* @flow */
import React from 'react';

const Toolbar: Function = ({
  className,
  marginBottom,
  mb,
  mt,
  children,
}: Object): React.Element<any> => (
  <div
    className={`${className} ${(marginBottom || mb) && 'margin-bottom'} ${mt &&
      'margin-top'} toolbar`}
    role="toolbar"
    style={{
      flex: '0 1 auto',
    }}
  >
    {children}
  </div>
);

export default Toolbar;
