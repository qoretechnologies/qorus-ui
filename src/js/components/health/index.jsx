/* @flow */
import React from 'react';

import HealthItem from './item';

const Health = (
  { title, className, children }: { title: string, className: string, children?: any}
) => (
  <div className={className}>
    <h6>{title}</h6>
    <table className="table table-condensed">
      <tbody>
        {React.Children.map(children, (c: React.Element<*>) => {
          if (c.type !== HealthItem) {
            const typeName = c.type.toString();
            console.warn(
              `Health component expect children type of 'HealthItem' not '${typeName}'`
            );
            return null;
          }
          return c;
        })}
      </tbody>
    </table>
  </div>
);

export {
  Health,
  HealthItem,
};
