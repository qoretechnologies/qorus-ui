/* @flow */
import React from 'react';

const Notification = (
  { type, children }: { type: 'success' | 'warning' | 'error', children?: string }
) => (
  <div className={`notification ${type}`}>
    {children}
  </div>
);

export default Notification;
