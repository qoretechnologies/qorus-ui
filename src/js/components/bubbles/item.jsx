/* @flow */
import React from 'react';

const Bubble = (
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
    className={`bubble ${type}`}
    onClick={handleClick}
  >
    {children}
  </div>
);

export default Bubble;
