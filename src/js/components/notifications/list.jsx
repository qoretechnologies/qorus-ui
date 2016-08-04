/* @flow */
import React from 'react';

const NotificationList = ({ children }: { children?: ReactClass<*> }) => (
  <div className="notifications">
    {children}
  </div>
);

export default NotificationList;
