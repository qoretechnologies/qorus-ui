/* @flow */
import React from 'react';

const HealthItem = ({ title, children }: { title: string, children?: any}) => (
  <tr>
    <th>{title}</th>
    <td>{children}</td>
  </tr>
);

export default HealthItem;
