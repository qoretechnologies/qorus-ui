/* @flow */
import React from 'react';

const Notification = (
  {
    type,
    children,
    onClick: handleClick,
  }: {
    type: 'success' | 'warning' | 'error',
    children?: string,
    onClick: Function,
  }
) => (
  <div
    className={`notification ${type}`}
    onClick={handleClick}
  >
    {children}
  </div>
);

export default Notification;
