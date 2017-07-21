/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

const Groups: Function = ({ children }: { children: any }): React.Element<any> => (
  <div className="groups">
    <h4>Groups</h4>
    {children}
  </div>
);

export default pure(['childen'])(Groups);
