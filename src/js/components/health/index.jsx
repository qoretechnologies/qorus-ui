/* @flow */
import React from 'react';
import pure from 'recompose/onlyUpdateForKeys';

import HealthItem from './item';

let Health = (
  {
    title,
    className,
    children,
  }: {
    title: string,
    className: string,
    children?: React.Element<HealthItem> | Array<React.Element<HealthItem>>,
  }
) => (
  <div className={className}>
    <h6>{title}</h6>
    <table className="table table-condensed">
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);

Health = pure(['title', 'className', 'children'])(Health);

export {
  Health,
  HealthItem,
};
