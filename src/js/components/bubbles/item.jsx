/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

const Bubble = ({
    type,
    children,
    onClick: handleClick,
}: {
  type: 'success' | 'warning' | 'error',
  children?: string,
  onClick: Function,
}): React.Element<any> => (
  <div
    className={`bubble ${type}`}
    onClick={handleClick}
  >
    {children}
  </div>
);

export default pure(['type', 'children'])(Bubble);
