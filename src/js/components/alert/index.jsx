/* @flow */
import React from 'react';
import classNames from 'classnames';

const Alert = (
  { children, bsStyle }: { children?: string, bsStyle: string }
) => (
  <div className={classNames('alert', bsStyle ? `alert-${bsStyle}` : '')}>{children}</div>
);

export default Alert;
