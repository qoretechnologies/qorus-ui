/* @flow */
import React from 'react';

const Alert = (
  { children, bsStyle }: { children?: string, bsStyle: string }
) => {
  let alertClass = '';

  if (bsStyle) {
    alertClass = `alert-${bsStyle}`;
  }
  return <div className={`alert ${alertClass}`}>{children}</div>;
};

export default Alert;
