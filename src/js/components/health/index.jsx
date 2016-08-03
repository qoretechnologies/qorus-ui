/* @flow */
import React from 'react';

import HealthItem from './item';

const Health = (
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

export {
  Health,
  HealthItem,
};
