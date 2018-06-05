/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

const Groups: Function = ({
  children,
  small,
}: {
  children: any,
  small?: boolean,
}): React.Element<any> => (
  <div className="groups">
    {small ? (
      <p>
        <strong>Groups</strong>
      </p>
    ) : (
      <h4>Groups</h4>
    )}
    {children}
  </div>
);

export default pure(['childen'])(Groups);
