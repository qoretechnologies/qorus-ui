/* @flow */
import React from 'react';

import Notification from './item';

const NotificationList = ({ children }: { children?: ReactClass<*> }) => (
  <div className="notifications">
    {React.Children.map(children, c => {
      if (c.type !== Notification) {
        const typeName = c.type.toString();
        console.warn(
          `NotificationList component expect children type of 'Notification' not '${typeName}'`
        );
        return null;
      }

      return c;
    })}
  </div>
);

export default NotificationList;
